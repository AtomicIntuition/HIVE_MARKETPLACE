"use client";

import { useState, useActionState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { submitTool, SubmitToolState } from "@/app/actions/submit-tool";
import { updateTool, UpdateToolState } from "@/app/actions/update-tool";

const STEPS = ["Basic Info", "Technical", "Pricing", "Review"];

const CATEGORIES = [
  { value: "payments", label: "Payments & Commerce" },
  { value: "communication", label: "Communication" },
  { value: "data", label: "Data & Databases" },
  { value: "devtools", label: "Developer Tools" },
  { value: "productivity", label: "Productivity" },
  { value: "ai-ml", label: "AI & ML" },
  { value: "content", label: "Content & Media" },
  { value: "analytics", label: "Analytics" },
];

const COMPATIBILITY_OPTIONS = ["Claude", "GPT", "Gemini", "Open Source"];

interface EnvVarEntry {
  name: string;
  description: string;
  required: boolean;
  placeholder: string;
}

export interface PublishFormInitialData {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string;
  features: string;
  githubUrl: string;
  docsUrl: string;
  npmPackage: string;
  installCommand: "npx" | "uvx";
  version: string;
  compatibility: string[];
  pricingModel: string;
  pricingPrice: string;
  pricingUnit: string;
  envVars: EnvVarEntry[];
}

interface PublishFormProps {
  initialData?: PublishFormInitialData;
  editMode?: boolean;
}

export function PublishForm({ initialData, editMode = false }: PublishFormProps) {
  const [step, setStep] = useState(0);

  const [submitState, submitAction, isSubmitPending] = useActionState<SubmitToolState, FormData>(
    submitTool,
    {}
  );

  const [updateState, updateAction, isUpdatePending] = useActionState<UpdateToolState, FormData>(
    updateTool,
    {}
  );

  const state = editMode ? updateState : submitState;
  const formAction = editMode ? updateAction : submitAction;
  const isPending = editMode ? isUpdatePending : isSubmitPending;

  // Form state
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [longDescription, setLongDescription] = useState(initialData?.longDescription ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl ?? "");
  const [docsUrl, setDocsUrl] = useState(initialData?.docsUrl ?? "");
  const [npmPackage, setNpmPackage] = useState(initialData?.npmPackage ?? "");
  const [installCommand, setInstallCommand] = useState<"npx" | "uvx">(initialData?.installCommand ?? "npx");
  const [version, setVersion] = useState(initialData?.version ?? "1.0.0");
  const [compatibility, setCompatibility] = useState<string[]>(initialData?.compatibility ?? []);
  const [pricingModel, setPricingModel] = useState(initialData?.pricingModel ?? "free");
  const [pricingPrice, setPricingPrice] = useState(initialData?.pricingPrice ?? "");
  const [pricingUnit, setPricingUnit] = useState(initialData?.pricingUnit ?? "call");
  const [features, setFeatures] = useState(initialData?.features ?? "");
  const [envVars, setEnvVars] = useState<EnvVarEntry[]>(initialData?.envVars ?? []);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!editMode && (!slug || slug === generateSlug(name))) {
      setSlug(generateSlug(value));
    }
  }

  function toggleCompatibility(value: string) {
    setCompatibility((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function addEnvVar() {
    setEnvVars((prev) => [...prev, { name: "", description: "", required: true, placeholder: "" }]);
  }

  function removeEnvVar(index: number) {
    setEnvVars((prev) => prev.filter((_, i) => i !== index));
  }

  function updateEnvVar(index: number, field: keyof EnvVarEntry, value: string | boolean) {
    setEnvVars((prev) =>
      prev.map((ev, i) => (i === index ? { ...ev, [field]: value } : ev))
    );
  }

  const fieldError = (field: string) =>
    state.fieldErrors?.[field]?.[0];

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                i < step
                  ? "bg-violet-600 text-white"
                  : i === step
                    ? "border-2 border-violet-500 text-violet-400"
                    : "border border-border/50 text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-px w-8 bg-border/50" />
            )}
          </div>
        ))}
      </div>

      {state.error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={formAction}>
        {/* Hidden fields for all steps */}
        {editMode && initialData && (
          <input type="hidden" name="submissionId" value={initialData.id} />
        )}
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="longDescription" value={longDescription} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="tags" value={tags} />
        <input type="hidden" name="githubUrl" value={githubUrl} />
        <input type="hidden" name="docsUrl" value={docsUrl} />
        <input type="hidden" name="npmPackage" value={npmPackage} />
        <input type="hidden" name="installCommand" value={installCommand} />
        <input type="hidden" name="version" value={version} />
        {compatibility.map((c) => (
          <input key={c} type="hidden" name="compatibility" value={c} />
        ))}
        <input type="hidden" name="pricingModel" value={pricingModel} />
        <input type="hidden" name="pricingPrice" value={pricingPrice} />
        <input type="hidden" name="pricingUnit" value={pricingUnit} />
        <input type="hidden" name="features" value={features} />
        <input type="hidden" name="envVars" value={JSON.stringify(envVars)} />

        <div className="rounded-xl border border-border/50 bg-card p-6">
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Tool Name</label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="My MCP Server"
                />
                {fieldError("name") && <p className="mt-1 text-xs text-red-400">{fieldError("name")}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-mcp-server"
                  disabled={editMode}
                />
                {fieldError("slug") && <p className="mt-1 text-xs text-red-400">{fieldError("slug")}</p>}
                <p className="mt-1 text-xs text-muted-foreground">
                  URL: hive-mcp.vercel.app/tools/{slug || "your-slug"}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Short Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of what your tool does"
                  maxLength={300}
                />
                {fieldError("description") && <p className="mt-1 text-xs text-red-400">{fieldError("description")}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Long Description (Markdown supported)</label>
                <textarea
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  rows={6}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder={"Describe your tool in detail...\n\n## Key Capabilities\n- Feature one\n- Feature two"}
                />
                {fieldError("longDescription") && <p className="mt-1 text-xs text-red-400">{fieldError("longDescription")}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Category</label>
                <select
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {fieldError("category") && <p className="mt-1 text-xs text-red-400">{fieldError("category")}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Tags (comma-separated)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="api, automation, payments"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Features (comma-separated)</label>
                <Input
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Payment processing, Customer management, Invoicing"
                />
              </div>
            </div>
          )}

          {/* Step 2: Technical */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Technical Details</h2>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">GitHub Repository URL</label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Documentation URL</label>
                <Input
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                  placeholder="https://docs.example.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Package Registry</label>
                <div className="flex gap-2 mb-3">
                  {(["npx", "uvx"] as const).map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => setInstallCommand(cmd)}
                      className={cn(
                        "rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors",
                        installCommand === cmd
                          ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                          : "border-border/50 text-muted-foreground hover:border-border"
                      )}
                    >
                      {cmd === "npx" ? "npm (npx)" : "PyPI (uvx)"}
                    </button>
                  ))}
                </div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Package Name</label>
                <Input
                  value={npmPackage}
                  onChange={(e) => setNpmPackage(e.target.value)}
                  placeholder={installCommand === "npx" ? "@scope/mcp-server-name" : "mcp-server-name"}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Used for the connect flow. Users will run: {installCommand === "uvx" ? `uvx ${npmPackage || "your-package"}` : `npx -y ${npmPackage || "your-package"}`}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Version</label>
                <Input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Compatibility</label>
                <div className="flex flex-wrap gap-2">
                  {COMPATIBILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleCompatibility(opt)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        compatibility.includes(opt)
                          ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                          : "border-border/50 text-muted-foreground hover:border-border"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {fieldError("compatibility") && <p className="mt-1 text-xs text-red-400">{fieldError("compatibility")}</p>}
              </div>

              {/* Environment Variables */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Environment Variables</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEnvVar}
                    className="gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Variable
                  </Button>
                </div>

                {envVars.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No environment variables configured. Add any API keys or secrets your tool requires.
                  </p>
                )}

                <div className="space-y-3">
                  {envVars.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/50 bg-background p-3 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={ev.name}
                            onChange={(e) => updateEnvVar(i, "name", e.target.value)}
                            placeholder="EXAMPLE_API_KEY"
                            className="font-mono text-xs"
                          />
                          <Input
                            value={ev.description}
                            onChange={(e) => updateEnvVar(i, "description", e.target.value)}
                            placeholder="Description of this variable"
                          />
                          <Input
                            value={ev.placeholder}
                            onChange={(e) => updateEnvVar(i, "placeholder", e.target.value)}
                            placeholder="Placeholder (e.g. sk-...)"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEnvVar(i)}
                          className="mt-1.5 rounded p-1 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ev.required}
                          onChange={(e) => updateEnvVar(i, "required", e.target.checked)}
                          className="rounded border-border"
                        />
                        Required
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Pricing Model</h2>

              <div className="space-y-3">
                {[
                  { value: "free", label: "Free", desc: "No charge for usage" },
                  { value: "per-call", label: "Per Call", desc: "Charge per API call" },
                  { value: "monthly", label: "Monthly", desc: "Monthly subscription" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                      pricingModel === option.value
                        ? "border-violet-500/30 bg-violet-500/5"
                        : "border-border/50 hover:border-border"
                    )}
                  >
                    <input
                      type="radio"
                      name="_pricingModel"
                      value={option.value}
                      checked={pricingModel === option.value}
                      onChange={(e) => setPricingModel(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        pricingModel === option.value
                          ? "border-violet-500"
                          : "border-border"
                      )}
                    >
                      {pricingModel === option.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {pricingModel !== "free" && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-sm text-muted-foreground">Price ($)</label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0"
                      value={pricingPrice}
                      onChange={(e) => setPricingPrice(e.target.value)}
                      placeholder="0.002"
                    />
                  </div>
                  <div className="w-32">
                    <label className="mb-1.5 block text-sm text-muted-foreground">Unit</label>
                    <select
                      className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-violet-500 focus:outline-none"
                      value={pricingUnit}
                      onChange={(e) => setPricingUnit(e.target.value)}
                    >
                      <option value="call">per call</option>
                      <option value="month">per month</option>
                      <option value="request">per request</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Review & Submit</h2>

              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 p-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Basic Info</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{name}</span></p>
                    <p><span className="text-muted-foreground">Slug:</span> <span className="text-foreground">{slug}</span></p>
                    <p><span className="text-muted-foreground">Category:</span> <span className="text-foreground">{CATEGORIES.find((c) => c.value === category)?.label}</span></p>
                    <p><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{description}</span></p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 p-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Technical</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Version:</span> <span className="text-foreground">{version}</span></p>
                    {githubUrl && <p><span className="text-muted-foreground">GitHub:</span> <span className="text-foreground">{githubUrl}</span></p>}
                    {npmPackage && <p><span className="text-muted-foreground">{installCommand === "uvx" ? "PyPI" : "npm"}:</span> <span className="text-foreground">{npmPackage}</span></p>}
                    <p><span className="text-muted-foreground">Compatibility:</span> <span className="text-foreground">{compatibility.join(", ")}</span></p>
                  </div>
                </div>

                {envVars.length > 0 && (
                  <div className="rounded-lg border border-border/50 p-4">
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Environment Variables</h3>
                    <div className="space-y-1.5 text-sm">
                      {envVars.map((ev, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <code className="rounded bg-background px-1.5 py-0.5 text-xs font-mono text-violet-400">
                            {ev.name || "UNNAMED"}
                          </code>
                          <span className="text-muted-foreground">{ev.description}</span>
                          {ev.required && (
                            <span className="text-xs text-amber-400">(required)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-border/50 p-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Pricing</h3>
                  <p className="text-sm text-foreground">
                    {pricingModel === "free"
                      ? "Free"
                      : `$${pricingPrice} / ${pricingUnit}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {editMode ? "Update Tool" : "Publish Tool"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
