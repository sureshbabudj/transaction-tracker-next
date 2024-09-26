import { Button } from "@/components/ui/button";
import { Form } from "./auth";
import { logout } from "./auth.action";

export default async function Logout() {
  return (
    <Form action={logout}>
      <Button>Sign out</Button>
    </Form>
  );
}
