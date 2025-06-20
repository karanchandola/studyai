"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  BookOpen,
  Clock,
  Award,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  Upload,
  MessageSquare,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useFlashcardStore } from "@/stores/flashcard-store";

export default function Dashboard() {
  const [userName, setUserName] = useState(null); // Default name for demo
  const [streakDays, setStreakDays] = useState(7);
  const [tasksToday, setTasksToday] = useState(5);
  // const [flashcardsReviewed, setFlashcardsReviewed] = useState(25);
  const [progress, setProgress] = useState(78);

   const { data: session} = useSession();

   const { flashcards } = useFlashcardStore(); // Access flashcards from Zustand store
  const flashcardCount = flashcards.length; // Calculate the number of flashcards

   if(session){
    userName === null? setUserName(session.user.name): '';
   }

  const stats = [
    {
      title: "Study Streak",
      value: `${streakDays} days`,
      icon: <Flame className="h-4 w-4 text-orange-500" />,
      description: "Keep it up!",
    },
    {
      title: "Tasks Today",
      value: tasksToday,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      description: "On track",
    },
    {
      title: "Flashcards Created",
      value: flashcardCount,
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      description: "+5 from yesterday",
    },
    {
      title: "Overall Progress",
      value: `${progress}%`,
      icon: <Target className="h-4 w-4 text-purple-500" />,
      description: "Excellent pace",
    },
  ];

  const recentMaterials = [
    { name: "Physics Notes", type: "PDF", date: "2024-03-20" },
    { name: "Chemistry Formulas", type: "DOC", date: "2024-03-19" },
    { name: "Math Problems", type: "PDF", date: "2024-03-18" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-t from-background to-orange-50/25 dark:to-orange-950/10 relative">
      {/* Background Pattern - visible in dark mode */}
      <div className="absolute inset-0  pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 py-8 relative">
        {/* Welcome Section */}
        <div className="space-y-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Study Materials */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Study Materials
                </CardTitle>
                <CardDescription>
                  Recently uploaded study materials and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] px-1">
                  <div className="space-y-3 pr-4">
                    {recentMaterials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors animate-in fade-in-50"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">{material.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {material.type} • {material.date}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-4 mt-6">
                  <Button className="w-full transition-all duration-300 hover:scale-105">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Material
                  </Button>
                  <Button variant="outline" className="w-full transition-all duration-300 hover:scale-105">
                    <Link href="/flashcards" className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Flashcards
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Planner */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Smart Planner
                </CardTitle>
                <CardDescription>
                  Your personalized study schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today" className="animate-in fade-in-50">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                  </TabsList>
                  <TabsContent value="today" className="space-y-4">
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 hover:-translate-x-1"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 text-center">
                              <div className="text-sm font-medium">
                                {new Date().getHours() + index + 1}:00
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Study Session {index + 1}</p>
                              <p className="text-sm text-muted-foreground">
                                Physics Chapter {index + 1}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Start
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="week">Weekly schedule content</TabsContent>
                  <TabsContent value="month">Monthly schedule content</TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Progress Analytics */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Physics</span>
                    <span className="text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Chemistry</span>
                    <span className="text-muted-foreground">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mathematics</span>
                    <span className="text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <Button variant="outline" className="w-full transition-all duration-300 hover:scale-105">
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={'/chatai'}>
                    <Button 
                    className="w-full transition-all duration-300 hover:scale-105 hover:bg-primary/90" 
                    variant="outline"
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask AI Tutor
                    </Button>
                </Link>
                <Button 
                  className="w-full transition-all duration-300 hover:scale-105 hover:bg-primary/90" 
                  variant="outline"
                >
                  <Link href="/flashcards" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Review Flashcards
                  </Link>
                </Button>
                <Button 
                  className="w-full transition-all duration-300 hover:scale-105 hover:bg-primary/90" 
                  variant="outline"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Take Practice Quiz
                </Button>
                <Button 
                  className="w-full transition-all duration-300 hover:scale-105 hover:bg-primary/90" 
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}