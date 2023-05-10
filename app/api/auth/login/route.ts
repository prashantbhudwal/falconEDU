import users from "../userData/userData.json";

type LoginRequestBody = {
  username: string;
  password: string;
};

export async function POST(request: Request) {
  const body: LoginRequestBody = await request.json();
  const { username, password } = body;

  const user = users.find(
    (user) => user.email === username && user.password === password
  );

  if (user && user.password === password) {
    const { password, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword));
  } else {
    return new Response(
      JSON.stringify({ message: "Username or password is incorrect" }),
      {
        status: 401,
      }
    );
  }
}
