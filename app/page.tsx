import type { Metadata } from "next";
import { GenerateLinkForm } from "./generate-link-form";

export const metadata: Metadata = {
  title: "Generate Login Link",
  description: "Generate a secure login link for users",
};

export default function GenerateLinkPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Generate Login Link
      </h1>
      <GenerateLinkForm />
    </div>
  );
}
