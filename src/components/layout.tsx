import React, { useEffect } from "react";
import { Link } from "gatsby";
import "./_reset.css";
// import "katex/dist/katex.min.css";
import "./layout.css";
import "./code.css";
import GitHubLogo from "../assets/GitHub-Mark.inline.svg";
import LinkedInLogo from "../assets/LinkedIn.inline.svg";

// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-link/

export function Layout(props: any) {
    useEffect(() => {
        if (window) {
            const onResize = () => {
                document.documentElement.style.setProperty(
                    "--scrollbar-width",
                    window.innerWidth - document.documentElement.clientWidth + "px"
                );
                // Viewport width without scrollbar
                document.documentElement.style.setProperty("--vw", document.documentElement.clientWidth / 100 + "px");
            };
            window.addEventListener("resize", onResize);
            onResize();
            return () => window.removeEventListener("resize", onResize);
        }
    }, []);

    return (
        <div className="siteRoot">
            <div className="bg">
                <div className="bg-left"></div>
                <div className="bg-main"></div>
                <div className="bg-right"></div>
            </div>
            <header>
                <nav className="siteNav">
                    <Link to={"/"}>
                        <h1>a.schultz</h1>
                    </Link>
                    <ul>
                        <li>
                            <Link to={"/about/"}>About</Link>
                        </li>
                        <li>
                            <a href="https://github.com/aschultz" title="GitHub">
                                <GitHubLogo />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/-aschultz" title="LinkedIn">
                                <LinkedInLogo />
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{props.children}</main>
            <footer></footer>
        </div>
    );
}
