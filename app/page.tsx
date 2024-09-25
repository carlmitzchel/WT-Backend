import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Web Technologies</h1>
          <p className="text-muted-foreground mt-2">
            tomasino web | tmsnw3btech
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
