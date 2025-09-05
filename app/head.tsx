// app/head.tsx (server component by default)
export const metadata = {
  title: "MERN Auth App",
  description: "Next.js frontend for MERN auth backend",
};

export default function Head() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
    </>
  );
}
