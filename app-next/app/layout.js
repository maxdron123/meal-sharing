import "./globals.css";
import Footer from "@/components/Footer/Footer.jsx";
import Navbar from "@/components/Navbar/Navbar.jsx";

export const metadata = {
  title: "HackYourFuture",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
