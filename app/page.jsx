"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Calendar, FileText, Slash as FlashCard, MessageSquare, Upload, Target, BarChart3, Users, Sparkles, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-secondary overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-[#ffa726]/5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,167,38,0.15) 2%, transparent 0%)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          {/* Decorative blobs */}
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-[#ffa726]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-[#ffa726]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-block animate-fade-in">
                  <div className="flex items-center gap-2 text-orange-700 bg-orange-100 dark:text-orange-200 dark:bg-orange-900/30 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered Learning</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-gray-900 dark:text-gray-50">
                  Turn Complexity into
                  <span className="block mt-2 text-orange-600 dark:text-orange-300">Clarity</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-[600px] mx-auto lg:mx-0">
                  Tired of struggling with overwhelming study materials? Let UNI-ED revolutionize your learning experience with AI-powered assistance, smart organization, and personalized study paths.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8 bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700">
                  Try Now!
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-900/20">
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Users className="h-5 w-5" />
                  <span>10k+ Students</span>
                </div>
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Brain className="h-5 w-5" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Target className="h-5 w-5" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-[600px] h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-lg" />
                <Image
                  src="/images/coverimage.png"
                  alt="UNI-ED Hero"
                  fill
                  className="object-contain"
                  priority
                />
                {/* Floating Elements */}
                <div className="absolute top-1/4 -left-8 w-24 h-24 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-1/4 right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Showcase */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-orange-50/50 dark:to-orange-950/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-50">
              Transform Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
              Discover how UNI-ED's powerful features can revolutionize your study experience
            </p>
          </div>

          {/* Feature Grid with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="Text Extraction"
              description="Extract text from PDFs, images, and scanned documents with AI-powered OCR technology."
              features={["Supports multiple file formats", "High accuracy OCR"]}
            />

            <FeatureCard
              icon={<FlashCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="AI Flashcards"
              description="Generate interactive flashcards with AI-powered questions and answers."
              features={["Smart spaced repetition", "Progress tracking"]}
            />

            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="AI Tutor"
              description="Get instant help and explanations from your personal AI tutor."
              features={["24/7 availability", "Personalized explanations"]}
            />

            <FeatureCard
              icon={<Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="Smart Planner"
              description="Organize your study schedule with AI-optimized planning."
              features={["Automated scheduling", "Smart reminders"]}
            />

            <FeatureCard
              icon={<Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="Practice Mode"
              description="Test your knowledge with AI-generated quizzes and track progress."
              features={["Adaptive questions", "Performance analytics"]}
            />

            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              title="Summarization"
              description="Convert long documents into concise, easy-to-understand summaries."
              features={["Key points extraction", "Multiple formats"]}
            />
          </div>


          {/* Call to Action */}
          <div className="mt-12 md:mt-16 text-center">
            <Button size="lg" className="text-lg px-8 bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700 group">
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-1 md:py-24 bg-orange-50 dark:bg-orange-950/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-50">
              Premium Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
              Unlock your full potential with our comprehensive learning services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Service Cards */}
            <ServiceCard
              icon={<Brain />}
              title="Personalized Learning"
              description="Get tailored study plans based on your learning style and goals."
              features={["Custom study paths", "Learning style analysis"]}
            />
            <ServiceCard
              icon={<Upload />}
              title="Cloud Storage"
              description="Access your study materials from anywhere, anytime."
              features={["Unlimited storage", "Cross-device sync"]}
            />
            <ServiceCard
              icon={<Users />}
              title="Collaboration"
              description="Share and collaborate with study groups and friends."
              features={["Real-time collaboration", "Group study tools"]}
            />
            <ServiceCard
              icon={<BarChart3 />}
              title="Progress Analytics"
              description="Track your learning journey with detailed analytics and insights."
              features={["Performance tracking", "Progress reports"]}
            />
            <ServiceCard
              icon={<Sparkles />}
              title="AI Writing Assistant"
              description="Improve your writing with AI-powered suggestions and feedback."
              features={["Grammar checking", "Style suggestions"]}
            />
            <ServiceCard
              icon={<Zap />}
              title="Premium Support"
              description="Get priority access to our support team and exclusive features."
              features={["24/7 priority support", "Advanced features"]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({ icon, title, description, features }) {
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg group-hover:bg-orange-500 transition-colors duration-300">
            <div className="h-6 w-6 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          </div>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-50">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon, title, description, features }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Card className="relative bg-white dark:bg-gray-900 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
