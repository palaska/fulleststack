import { Fragment } from "hono/jsx";

import type { EmailTemplate } from "../email-template";

export type ForgotPasswordParams = {
  url: string;
};

export const ForgotPassword: EmailTemplate<ForgotPasswordParams> = { subject: () => "Reset your password", body };

function body({ url }: ForgotPasswordParams) {
  return (
    <Fragment>
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
      >
        <h1 style={{
          color: "#333",
          fontSize: "24px",
          marginBottom: "20px",
        }}
        >
          Reset Password
        </h1>
        <p style={{
          color: "#666",
          fontSize: "16px",
          lineHeight: "1.5",
          marginBottom: "20px",
        }}
        >
          Click the link below to reset your password:
        </p>
        <a
          href={url}
          style={{
            backgroundColor: "#0070f3",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "5px",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
          }}
        >
          Reset Password
        </a>
      </div>
    </Fragment>
  );
}
