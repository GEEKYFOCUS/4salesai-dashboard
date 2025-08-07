"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessInfoStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  formData: any;
  
}

export function BusinessInfoStep({ onNext, onBack, canGoBack, formData }: BusinessInfoStepProps) {
  const [businessData, setBusinessData] = useState({
    companyName: formData.companyName || "",
    industry: formData.industry || "",
    website: formData.website || "",
    description: formData.description || "",
    targetAudience: formData.targetAudience || "",
  });
  const [errors, setErrors] = useState({
    companyName: "",
    industry: "",
    website: "",
    description: "",
    targetAudience: "",
    general:""
  });

  const validateForm = () => {
    const newErrors = {
      companyName: "",
      industry: "",
      website: "",
      description: "",
      targetAudience: "",
      general:""
    };
    let isValid = true;

    // Required fields
    if (!businessData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
      isValid = false;
    }
    if (!businessData.industry) {
      newErrors.industry = "Industry is required";
      isValid = false;
    }
    if (!businessData.description.trim()) {
      newErrors.description = "Business description is required";
      isValid = false;
    }
    if (!businessData.targetAudience.trim()) {
      newErrors.targetAudience = "Target audience is required";
      isValid = false;
    }

    // Website validation (optional field, but validate if provided)
    if (businessData.website && !isValidUrl(businessData.website)) {
      newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
      onNext(businessData);
  
  };

  const handleInputChange = (field: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field when user types
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Tell us about your business</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && <p className="text-red-500">{errors.general}</p>}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="Acme Corp"
              value={businessData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              required
            />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              required
              value={businessData.industry}
              onValueChange={(value) => handleInputChange("industry", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.yourcompany.com"
              required
              value={businessData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
            {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what your business does, your products/services, and what makes you unique..."
              value={businessData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Textarea
              id="targetAudience"
              placeholder="Describe your ideal customers, their pain points, and what they're looking for..."
              value={businessData.targetAudience}
              onChange={(e) => handleInputChange("targetAudience", e.target.value)}
              rows={3}
              required
            />
            {errors.targetAudience && <p className="text-red-500 text-sm">{errors.targetAudience}</p>}
          </div>

          <div className="flex justify-between pt-4">
            {canGoBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}