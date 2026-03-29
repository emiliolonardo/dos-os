'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Image as ImageIcon,
  Plus,
  X,
  RefreshCw,
  Save,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Categories for selection
const CATEGORIES = [
  { value: 'product', label: 'Product', description: 'Physical or digital products' },
  { value: 'service', label: 'Service', description: 'Services and solutions' },
  { value: 'experience', label: 'Experience', description: 'User/customer experiences' },
  { value: 'feature', label: 'Feature', description: 'Product features and functionality' },
  { value: 'campaign', label: 'Campaign', description: 'Marketing and communication campaigns' },
];

// Constraint suggestions
const CONSTRAINT_SUGGESTIONS = [
  'Budget-friendly',
  'Quick to implement',
  'Sustainable/Eco-friendly',
  'Mobile-first',
  'Accessible',
  'Scalable',
  'Low maintenance',
  'High engagement',
  'Cross-platform',
  'Privacy-focused',
];

// Generated concept type
interface GeneratedConcept {
  title: string;
  description: string;
  category: string;
  tags: string[];
  content?: string;
  imageUrl?: string;
  variants?: GeneratedConcept[];
}

interface ConceptGeneratorProps {
  onConceptGenerated?: (concept: GeneratedConcept) => void;
  onSaveAsDraft?: (concept: GeneratedConcept) => void;
  onAddToProject?: (concept: GeneratedConcept) => void;
  defaultCategory?: string;
  projectId?: string;
  className?: string;
}

export function ConceptGenerator({
  onConceptGenerated,
  onSaveAsDraft,
  onAddToProject,
  defaultCategory = 'product',
  projectId,
  className,
}: ConceptGeneratorProps) {
  const { toast } = useToast();
  
  // Form state
  const [topic, setTopic] = React.useState('');
  const [category, setCategory] = React.useState(defaultCategory);
  const [constraints, setConstraints] = React.useState<string[]>([]);
  const [newConstraint, setNewConstraint] = React.useState('');
  const [generateImage, setGenerateImage] = React.useState(false);
  const [variantCount, setVariantCount] = React.useState(3);
  
  // UI state
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [generatedConcept, setGeneratedConcept] = React.useState<GeneratedConcept | null>(null);
  const [selectedVariant, setSelectedVariant] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Add constraint
  const addConstraint = (constraint: string) => {
    if (constraint.trim() && !constraints.includes(constraint.trim())) {
      setConstraints(prev => [...prev, constraint.trim()]);
      setNewConstraint('');
    }
  };

  // Remove constraint
  const removeConstraint = (constraint: string) => {
    setConstraints(prev => prev.filter(c => c !== constraint));
  };

  // Handle form submission
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic required',
        description: 'Please enter a topic for concept generation.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedConcept(null);

    try {
      const response = await fetch('/api/concepts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          constraints,
          generateImage,
          variantCount,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate concept');
      }

      setGeneratedConcept(data.data.concept);
      onConceptGenerated?.(data.data.concept);
      
      toast({
        title: 'Concept generated!',
        description: 'Your AI-powered concept has been created successfully.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Generation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Get current concept to display (main or variant)
  const currentConcept = React.useMemo(() => {
    if (!generatedConcept) return null;
    if (selectedVariant !== null && generatedConcept.variants?.[selectedVariant]) {
      return generatedConcept.variants[selectedVariant];
    }
    return generatedConcept;
  }, [generatedConcept, selectedVariant]);

  // Handle save as draft
  const handleSaveAsDraft = () => {
    if (currentConcept) {
      onSaveAsDraft?.(currentConcept);
      toast({
        title: 'Saved as draft',
        description: 'Concept has been saved as a draft.',
      });
    }
  };

  // Handle add to project
  const handleAddToProject = () => {
    if (currentConcept) {
      onAddToProject?.(currentConcept);
      toast({
        title: 'Added to project',
        description: 'Concept has been added to your project.',
      });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Concept Generator</CardTitle>
              <CardDescription>
                Generate innovative concepts powered by artificial intelligence
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Idea</Label>
            <Textarea
              id="topic"
              placeholder="Describe your idea or topic for concept generation..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible for better results
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex flex-col">
                      <span>{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{cat.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <Label>Constraints (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {constraints.map(constraint => (
                <Badge key={constraint} variant="secondary" className="gap-1">
                  {constraint}
                  <button onClick={() => removeConstraint(constraint)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a constraint..."
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addConstraint(newConstraint);
                  }
                }}
              />
              <Button variant="outline" size="sm" onClick={() => addConstraint(newConstraint)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CONSTRAINT_SUGGESTIONS.filter(s => !constraints.includes(s)).slice(0, 5).map(suggestion => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => addConstraint(suggestion)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span>Advanced Options</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Generate Image Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="generate-image">Generate Image</Label>
                  <p className="text-xs text-muted-foreground">
                    Create a visual representation of the concept
                  </p>
                </div>
                <Switch
                  id="generate-image"
                  checked={generateImage}
                  onCheckedChange={setGenerateImage}
                />
              </div>

              {/* Variant Count */}
              <div className="space-y-2">
                <Label>Number of Variants</Label>
                <Select value={variantCount.toString()} onValueChange={(v) => setVariantCount(parseInt(v))}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {n === 1 ? 'variant' : 'variants'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Concept
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Generated Concept Preview */}
      <AnimatePresence>
        {generatedConcept && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      {currentConcept?.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {currentConcept?.description}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    AI Generated
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Variant Tabs */}
                {generatedConcept.variants && generatedConcept.variants.length > 0 && (
                  <div className="space-y-2">
                    <Label>Concept Variants</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedVariant === null ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedVariant(null)}
                      >
                        Main Concept
                      </Badge>
                      {generatedConcept.variants.map((_, idx) => (
                        <Badge
                          key={idx}
                          variant={selectedVariant === idx ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setSelectedVariant(idx)}
                        >
                          Variant {idx + 1}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {currentConcept?.imageUrl && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={currentConcept.imageUrl}
                      alt={currentConcept.title}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}

                {/* Tags */}
                {currentConcept?.tags && currentConcept.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentConcept.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Content */}
                {currentConcept?.content && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap text-sm">
                      {currentConcept.content}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleGenerate} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button variant="outline" onClick={handleSaveAsDraft} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </Button>
                  {projectId && (
                    <Button onClick={handleAddToProject} className="gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Add to Project
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Ideas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Quick Ideas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Smart home automation system',
              'Sustainable packaging solution',
              'Mental wellness mobile app',
              'Virtual team collaboration tool',
              'AI-powered learning platform',
            ].map(idea => (
              <Badge
                key={idea}
                variant="outline"
                className="cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => setTopic(idea)}
              >
                {idea}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConceptGenerator;
