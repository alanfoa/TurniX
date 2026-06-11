import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Shield, User } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailError = email && !EMAIL_RE.test(email) ? "Email inválido" : null;
  const passwordError = password && password.length < 6 ? "Mínimo 6 caracteres" : null;
  const canSubmit = useMemo(() => EMAIL_RE.test(email) && password.length >= 6, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Credenciales inválidas");
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
    setError("");
    try {
      await login(demoEmail, "admin123");
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Credenciales inválidas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Ingresá tu email y contraseña</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="text-xs text-destructive">{emailError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Ingresar
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿No tenés cuenta?{" "}
              <Link to="/register" className="text-primary underline">
                Registrarse
              </Link>
            </p>
          </CardFooter>
        </form>
        <div className="px-6 pb-6">
          <Separator className="mb-4" />
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleDemoLogin("admin@turnix.com")}
            >
              <Shield className="w-4 h-4" />
              Ingresar como Administrador (Demo)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleDemoLogin("cliente@turnix.com")}
            >
              <User className="w-4 h-4" />
              Ingresar como Cliente (Demo)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
