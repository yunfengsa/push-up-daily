"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export default function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignIn) {
        let res;
        if (email.includes("@")) {
          res = await authClient.signIn.email({
            email,
            password,
          }, {
            onSuccess: () => router.push("/"),
            onError: (ctx) => setError(ctx.error.message || "登录失败，请重试")
          });
        } else {
          res = await authClient.signIn.username({
            username: email,
            password,
          }, {
            onSuccess: () => router.push("/"),
            onError: (ctx) => setError(ctx.error.message || "登录失败，请重试")
          });
        }
        if (res.error) throw res.error;
      } else {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          username: username || undefined,
        }, {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            setError(ctx.error.message || "注册失败，请重试");
          }
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生了未知错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card animate>
        <CardBody className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            {/* Logo/Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-[var(--shadow-lg)]"
              style={{ background: 'var(--primary-gradient)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
                <circle cx="12" cy="8" r="2" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gradient">
              {isSignIn ? "欢迎回来" : "创建账户"}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {isSignIn
                ? "请输入您的账号或邮箱进行登录"
                : "开始记录你的每日俯卧撑"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[var(--foreground)]">
                    昵称
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="您的昵称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border-2 border-[var(--primary-light)] bg-white/50
                             text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                             focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]
                             outline-none transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-[var(--foreground)]">
                    用户名
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="您的用户名 (用于登录)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border-2 border-[var(--primary-light)] bg-white/50
                             text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                             focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]
                             outline-none transition-all duration-200"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">
                {isSignIn ? "账号 / 邮箱" : "邮箱"}
              </label>
              <input
                id="email"
                type={isSignIn ? "text" : "email"}
                placeholder={isSignIn ? "请输入用户名或邮箱" : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border-2 border-[var(--primary-light)] bg-white/50
                         text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                         focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]
                         outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">
                密码
              </label>
              <input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border-2 border-[var(--primary-light)] bg-white/50
                         text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                         focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]
                         outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger-light)] rounded-xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
            >
              {isSignIn ? "登录" : "注册"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--muted-foreground)]/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[var(--glass-bg)] text-[var(--muted)]">或</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError(null);
              }}
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
            >
              {isSignIn
                ? "还没有账号？立即注册"
                : "已有账号？立即登录"}
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-[var(--muted)] mt-6">
        每日俯卧撑 · 坚持运动，见证成长
      </p>
    </div>
  );
}