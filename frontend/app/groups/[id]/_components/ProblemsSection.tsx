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

                if (!cloudName || !uploadPreset) {
                    console.error("Cloudinary not configured");
                    throw new Error("Image upload configuration missing");
                }

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', uploadPreset);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                const data = await response.json();
                imageUrl = data.secure_url;
            }

            await sendMessage(roomId, user.uid, user.displayName || 'Anonymous', inputText, type, imageUrl);
            setInputText("");
            clearFile();
        } catch (error) {
            console.error("Failed to send message", error);
            // Optionally add a toast here for better UX
            alert("Failed to send message: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Discussion & Problems
                </h2>
            </div>

            <ScrollArea className="flex-1 min-h-0 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.userId === user?.uid ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMessageId(activeMessageId === msg.id ? null : msg.id);
                                }}
                                className={`cursor-pointer max-w-[85%] rounded-lg p-3 group relative transition-all ${msg.type === 'problem'
                                    ? 'bg-red-500/10 border border-red-500/50'
                                    : msg.userId === user?.uid
                                        ? 'bg-blue-600'
                                        : 'bg-slate-800'
                                    } ${activeMessageId === msg.id ? 'ring-2 ring-white/20' : ''}`}
                            >
                                {msg.type === 'problem' && msg.status !== 'deleted' && (
                                    <span className="text-xs font-bold text-red-400 block mb-1 flex items-center gap-1">
                                        <Hash className="w-3 h-3" /> PROBLEM
                                    </span>
                                )}
                                <p className="text-xs text-slate-400 mb-1">{msg.userName}</p>

                                {msg.status === 'deleted' ? (
                                    <p className="text-sm text-slate-400 italic">This message has been deleted</p>
                                ) : (
                                    <>
                                        {/* Image Display */}
                                        {msg.imageUrl && (
                                            <div className="mb-2 mt-1">
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Attached content"
                                                    className="rounded-md max-h-48 object-cover border border-white/10"
                                                />
                                            </div>
                                        )}
                                        <p className="text-sm text-white break-words">{msg.text}</p>
                                    </>
                                )}
                            </div>

                            {/* Action Bar (React | Delete) - Appearing below the message */}
                            {activeMessageId === msg.id && msg.status !== 'deleted' && (
                                <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-top-1 border border-white/10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); /* Implement React later */ }}
                                        className="hover:text-white transition-colors"
                                    >
                                        React
                                    </button>
                                    {msg.userId === user?.uid && (
                                        <>
                                            <div className="w-px h-3 bg-white/20" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Image Preview */}
            {previewUrl && (
                <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                    <div className="relative group">
                        <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded border border-slate-700" />
                        <button
                            onClick={clearFile}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">{selectedFile?.name}</span>
                </div>
            )}

            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!user || isUploading}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Attach Image"
                    >
                        <Paperclip className="w-4 h-4" />
                    </Button>

                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={user ? "Type a message..." : "Sign in to chat"}
                        disabled={!user || isUploading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend('chat');
                            }
                        }}
                        className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleSend('problem')}
                        disabled={!user || (!inputText.trim() && !selectedFile) || isUploading}
                        title="Post as Problem"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                        <Hash className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        onClick={() => handleSend('chat')}
                        disabled={!user || (!inputText.trim() && !selectedFile) || isUploading}
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
