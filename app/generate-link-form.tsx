"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, CheckCircle2, Copy, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
type Environment = "production" | "preview" | "pre-production" | "local";
export function GenerateLinkForm() {
  const [environment, setEnvironment] = useState<Environment>("production");
  const [loginLink, setLoginLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    setError("");
    setLoginLink("");

    try {
      const response = await fetch("/api/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ environment }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate link");
      }

      const data = await response.json();
      setLoginLink(data.link);
    } catch {
      setError(
        "An error occurred while generating the link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loginLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-4">
        <RadioGroup
          value={environment}
          onValueChange={(value) => setEnvironment(value as Environment)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="production" id="production" />
            <Label className="cursor-pointer" htmlFor="production">
              Production
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="preview" id="preview" />
            <Label className="cursor-pointer" htmlFor="preview">
              Development (Preview)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pre-production" id="pre-production" />
            <Label className="cursor-pointer" htmlFor="pre-production">
              Pre-Production
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="local" id="local" />
            <Label className="cursor-pointer" htmlFor="local">
              Localhost
            </Label>
          </div>
        </RadioGroup>
        <Button
          onClick={handleGenerateLink}
          disabled={isLoading}
          className="w-full text-white bg-primary hover:bg-primary-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Link"
          )}
        </Button>
      </div>

      {loginLink && (
        <>
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <a href={loginLink} className="font-medium underline break-all">
                {loginLink}
              </a>
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="icon"
            className="h-10 my-1 text-white p-2 w-full"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-black" />
            ) : (
              <Copy className="h-4 w-4 text-black" />
            )}
          </Button>
        </>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
