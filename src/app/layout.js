import './globals.css';

export const metadata = {
  title: 'منيو زهرة بلدنا',
  description: 'نكهات أصيلة، تجربة استثنائية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}
