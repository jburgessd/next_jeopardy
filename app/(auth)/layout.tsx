export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen min-w-screen justify-center font-korinna">
      <div className="grid-background-gradient" />
      <div className="grid-background">{children}</div>
    </main>
  );
}
