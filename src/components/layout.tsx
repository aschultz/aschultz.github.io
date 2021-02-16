import React from "react";
import { Link } from "gatsby";
import "./_reset.css";
// import "katex/dist/katex.min.css";
// import "prism-themes/themes/prism-vs.css";
import "./layout.css";
import GitHubLogo from "../assets/GitHub-Mark.inline.svg";
import LinkedInLogo from "../assets/LinkedIn.inline.svg";

// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-link/

export function Layout(props: any) {
    return (
        <div className="siteRoot">
            <header>
                <nav className="siteNav">
                    <Link to={"/"}>
                        <h1>a.schultz</h1>
                    </Link>
                    <ul>
                        <li>
                            <Link to={"/about"}>About</Link>
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
