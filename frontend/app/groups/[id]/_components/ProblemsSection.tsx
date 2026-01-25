'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Hash, BookOpen, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
}

// Mock problems for now - can be integrated with backend later
const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Find the derivative',
    description: 'Calculate the derivative of f(x) = x³ + 2x² - 5x + 1',
    difficulty: 'Medium',
    solved: false
  },
  {
    id: '2',
    title: 'Solve quadratic equation',
    description: 'Solve x² - 5x + 6 = 0',
    difficulty: 'Easy',
    solved: true
  }
];

export function ProblemsSection({ roomId }: { roomId: string }) {
  const [problems] = useState<Problem[]>(mockProblems);
  const [showAddProblem, setShowAddProblem] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Problems ({problems.length})
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAddProblem(!showAddProblem)}
            className="h-7 text-xs text-slate-400 hover:text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {problems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Hash className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No problems yet</p>
            <p className="text-xs mt-1">Add problems to solve together</p>
          </div>
        ) : (
          problems.map((problem) => (
            <div
              key={problem.id}
              className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-medium text-white line-clamp-1">
                  {problem.title}
                </h4>
                <Badge
                  variant="outline"
                  className={`text-xs ${getDifficultyColor(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                {problem.description}
              </p>
              {problem.solved && (
                <div className="flex items-center gap-1 text-green-500">
                  <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-xs">Solved</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Problem Form (if shown) */}
      {showAddProblem && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Problem title..."
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <Textarea
              placeholder="Problem description..."
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 resize-none h-20"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Add Problem
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddProblem(false)}
                className="text-slate-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


