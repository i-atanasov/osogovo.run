import React from "react"
import { Footer, Header, LayoutContainer, Logo } from "./styles"
import Button from "../Button/Button";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

  return (
    <>
      <head>
        <title>Osogovo run</title>
        <meta name="description" content="Welcome to Osogovo run" />
        <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes'
        />
        <link rel="icon" sizes="192x192" href='https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Ruen_IMG_4742.jpg/500px-Ruen_IMG_4742.jpg' />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <LayoutContainer>
            <Header>
                <video src='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/osogovo-run-21-sec.mp4' autoPlay loop muted playsInline>
                    Your browser does not support the video tag.
                </video>
                <Logo href="/" />
                <Button highlight={true} onClick={() => {
                    window.location.href = '/register'
                }} label="Регистрирай се" />
            </Header>
            <main>{children}</main>
            <Footer>Copyright © 2025 Osogovo Run</Footer>
        </LayoutContainer>
    </>
  );
};

export default Layout;
