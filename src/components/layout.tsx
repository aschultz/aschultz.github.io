import React from "react";
import { Link } from "gatsby";
import "./layout.css";
import GitHubLogo from "../assets/GitHub-Mark.inline.svg";

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
                                <GitHubLogo width={64} height={64} />
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{props.children}</main>
            <aside></aside>
            <footer></footer>
        </div>
    );
}
