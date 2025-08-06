import React from "react"
import { LayoutContainer } from "./styles"

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    return (
        <LayoutContainer>
            <main>{children}</main>
        </LayoutContainer>
    );
};

export default Layout;
