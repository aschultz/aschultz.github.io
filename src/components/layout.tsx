import React from "react";
import { Link } from "gatsby";

// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-link/

export function Layout(props: any) {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link to={"/about"}>About</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{props.children}</main>
            <aside></aside>
        </div>
    );
}
