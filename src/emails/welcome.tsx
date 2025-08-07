import { Heading, Button, Html } from "@react-email/components";
import * as React from 'react';

export default function Email() {
  return (
    <Html>
      <Heading as="h1" style={{ fontFamily: 'sans-serif' }}>
        Добре дошли на Osogovo Run!
      </Heading>
      <Button
        href="https://osogovo.run"
        style={{ fontFamily: 'sans-serif' , background: "blueviolet", color: "white", padding: "12px 20px" }}
      >
        Посетете Osogovo Run
      </Button>
    </Html>
  );
}
