import "./globals.css";


export const metadata = {
  title: "Paisa Games Store",
  description: "The best place to buy games",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
