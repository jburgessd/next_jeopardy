export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-korinna">
      <div className="grid-background-gradient" />
      <div className="grid-background">{children}</div>
    </main>
  );
}
