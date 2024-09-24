import { Form } from "./auth";
import { logout } from "./auth.action";

export default async function Logout() {
  return (
    <Form action={logout}>
      <button>Sign out</button>
    </Form>
  );
}
