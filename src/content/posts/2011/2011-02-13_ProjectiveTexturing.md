---
title: Projective Texturing
date: 2011-02-13
summary: How to map the vertices of a scene into shadow map texture space
---

While working on my shadow mapping system, I finally figured out how to correctly map vertex positions from my scene into shadow map texture space. It’s not super complicated, but I had to scrounge around a lot on the web to come up with a satisfying list of operations. Hopefully the following code can help others get there faster.

In my system, as with most, we render the scene from the light’s POV and save the depth data. We then render the scene from the camera’s POV and use the generated shadow map to calculate whether pixels seen by the camera are shadowed or not. This second stage requires taking vertex positions from an object and (in the vertex and pixel shaders) converting them into shadow-map texture coordinates so that we can sample from the shadow map correctly. To do this, we can generate a matrix to get most of the way there and then use tex2Dproj to do the texture lookup.

```cpp
/// <summary>
/// Generates a matrix the converts from projection space to [0,1] texture space
/// for projective texturing, flipping the Y axis in the process.
/// Optionally includes the half-texel offset necessary in DirectX9 to properly align to texels.
/// </summary>
public static Matrix CreateTextureMatrix(int texWidth, int texHeight, bool includeHalfTexelOffset = true, bool flipY = true)
{
    // Calculate translation for conversion + DX9 half-pixel offset
    float xOffset = 0.5f + (includeHalfTexelOffset ? 0.5f / texWidth : 0f);
    float yOffset = 0.5f + (includeHalfTexelOffset ? 0.5f / texHeight : 0f);
    float yScale = flipY ? -0.5f : 0.5f;

    // We want to remap [-1,1] clip space to [0,1] texture space
    // Multiplying a projected vector by the following matrix should give us
    // x' = 0.5x + xOffset * w
    // y' = -0.5y + yOffset * w
    // z' = 0
    // w' = w
    Matrix matTex = new Matrix(0.5f,    0.0f,    0.0f, 0.0f,
                               0.0f,    yScale,  0.0f, 0.0f, //Flip y axis
                               0.0f,    0.0f,    0.0f, 0.0f,
                               xOffset, yOffset, 0.0f, 1.0f);
    return matTex;
}
```

```cpp
// This sets the matrix for converting from world space to shadow-map texture coordinates. I
// use the value in the vertex shader for rendering the scene.
shadowEffect.Parameters["LightViewProjTex0"].SetValue(
                        light.View * light.Projection *
                        CreateTextureMatrix(shadowMap.Width, shadowMap.Height, true, true)
);
```

```hlsl
// The following is in the vertex shader for rendering the scene from the camera's POV
// LightView0 is light.View
// LightViewProj0 is light.View * light.Projection

float4 Po = float4(IN.Position.xyz, 1); //Object space position
float4 Pw = float4(mul(Po, World).xyz, 1); //World space position

...

// Calculate shadow map texture space position of vertex. The xy values will contain u*w and v*w.
// We have to wait to perform this divide because otherwise the texture interpolator will muck it up.
OUT.LightMap0 = mul(Pw, LightViewProjTex0);

if(UseLinearDepth)
{
    float4 LightViewPos = mul(Pw, LightView0); //Light-space position of vertex
    OUT.LightMap0.z = (abs(LightViewPos.z) - DepthRange.x) * DepthRange.y; //Store depth in the z coord
}
else
{
    float4 LightViewProjPos = mul(Pw, LightViewProj0); //Projected light-space position of vertex
    OUT.LightMap0.z = LightViewProjPos.z / LightViewProjPos.w; //Store depth in the z coord
}
```

```hlsl
// In the pixel shader, we need to perform the perspective divide on the uv coords. We can either do this directly and then use tex2D...
float2 shadowMapUV = IN.LightMap0.xy / IN.LightMap0.w;
float shadowMapValue = tex2D(shadowMapSampler, shadowMapUV);

// Or we can use the tex2Dproj function to do the math for us
float4 shadowMapUV = IN.LightMap0;
float shadowMapValue = tex2Dproj(shadowMapSampler, shadowMapUV); //Performs xy / w automatically
```

Most of what I have above is gleaned from [Diary of a Graphics Programmer](https://diaryofagraphicsprogrammer.blogspot.com/2008/09/calculating-screen-space-texture.html) and [gamedev.net](https://www.gamedev.net/topic/301151-projective-texturing-and-tex2dproj/), though the former is a little confusing, as the half-pixel offset should be $\frac{1}{2 \times TargetWidth}$, not $\frac{TargetWidth}{2}$.
