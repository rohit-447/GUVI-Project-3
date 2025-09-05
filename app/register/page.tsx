"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(form);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
