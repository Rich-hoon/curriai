"use client";

import { Card, CardContent } from "@myapp/ui/components/card";
import { Clock, CheckCircle, BookOpen, Star, TrendingUp, Users } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

const iconMap = {
  clock: Clock,
  "check-circle": CheckCircle,
  "book-open": BookOpen,
  star: Star,
  "trending-up": TrendingUp,
  users: Users,
};

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
    border: "border-yellow-200",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    border: "border-orange-200",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    border: "border-red-200",
  },
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="space-y-4">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        const colors = colorMap[stat.color as keyof typeof colorMap];
        
        return (
          <Card 
            key={index}
            className={`border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colors.bg} mr-4`}>
                  <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
