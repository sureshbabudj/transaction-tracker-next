import { Signin } from "./components/signin";

export default async function Home({ params }: { params: { slug: string } }) {
  if (params.slug === "signup") {
    return <Signin signInPage={false} />;
  }
  return <Signin signInPage={true} />;
}
