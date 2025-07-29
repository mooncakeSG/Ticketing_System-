'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Edit, Trash2, Reply, MoreVertical, User, Clock, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Comment {
  id: string
  content: string
  author: string
  authorAvatar?: string
  createdAt: string
  updatedAt?: string
  isEdited: boolean
  likes: number
  dislikes: number
  replies: Comment[]
  isPrivate: boolean
}

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'I can reproduce this issue on my end. It seems to be related to the new update that was deployed last week. Let me investigate further and get back to you.',
    author: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 3,
    dislikes: 0,
    replies: [],
    isPrivate: false,
    isEdited: false
  },
  {
    id: '2',
    content: 'Thanks for the detailed report. I\'ve assigned this to our senior developer who will look into it immediately.',
    author: 'Sarah Wilson',
    createdAt: '2024-01-15T11:15:00Z',
    likes: 1,
    dislikes: 0,
    replies: [
      {
        id: '2-1',
        content: 'I\'ve started working on this. The issue appears to be in the authentication module.',
        author: 'Mike Johnson',
        createdAt: '2024-01-15T12:00:00Z',
        likes: 2,
        dislikes: 0,
        replies: [],
        isPrivate: true,
        isEdited: false
      }
    ],
    isPrivate: false,
    isEdited: false
  },
  {
    id: '3',
    content: 'Can you provide more details about the steps to reproduce this issue? Also, what browser and operating system are you using?',
    author: 'Jane Smith',
    createdAt: '2024-01-15T14:20:00Z',
    likes: 0,
    dislikes: 0,
    replies: [],
    isPrivate: false,
    isEdited: false
  }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export default function TicketComments() {
  const params = useParams()
  const ticketId = params.id as string
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `new-${Date.now()}`,
      content: newComment,
      author: 'Current User',
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isPrivate,
      isEdited: false
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    setIsPrivate(false)
  }

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      content: replyContent,
      author: 'Current User',
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isPrivate: false,
      isEdited: false
    }

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
    setReplyContent('')
    setReplyingTo(null)
  }

  const handleEditComment = (commentId: string, content: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, content, updatedAt: new Date().toISOString(), isEdited: true }
        : comment
    ))
    setEditingComment(null)
    setEditContent('')
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId))
  }

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))
  }

  const handleDislike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    ))
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`border border-gray-700 rounded-lg p-4 ${isReply ? 'ml-8' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{comment.author}</span>
              {comment.isPrivate && (
                <Badge variant="secondary" className="text-xs">Private</Badge>
              )}
              <span className="text-gray-400 text-sm">{formatRelativeTime(comment.createdAt)}</span>
              {comment.isEdited && (
                <span className="text-gray-500 text-xs">(edited)</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
                <ThumbsUp className="h-3 w-3 mr-1" />
                {comment.likes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDislike(comment.id)}>
                <ThumbsDown className="h-3 w-3 mr-1" />
                {comment.dislikes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)}>
                <Reply className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setEditingComment(comment.id)
                setEditContent(comment.content)
              }}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {editingComment === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => handleEditComment(comment.id, editContent)}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
          )}

          {replyingTo === comment.id && (
            <div className="mt-4 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                  Reply
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/tickets/${ticketId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Ticket Comments</h1>
              <p className="text-gray-400">View and add comments for ticket #{ticketId}</p>
            </div>
          </div>
        </div>

        {/* Add Comment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Add Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                rows={4}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private-comment"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-gray-600"
                  />
                  <label htmlFor="private-comment" className="text-sm text-gray-400">
                    Private comment (only visible to team members)
                  </label>
                </div>
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Comments ({comments.length})</span>
              <Badge variant="secondary">
                {comments.reduce((sum, comment) => sum + comment.replies.length, 0)} replies
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.map(comment => renderComment(comment))}
              
              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No comments yet</p>
                  <p className="text-gray-500 text-sm">Be the first to add a comment</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comment Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Comment Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Be clear and concise in your comments</p>
              <p>• Use private comments for internal team discussions</p>
              <p>• Include relevant details and context</p>
              <p>• Be respectful and professional</p>
              <p>• Use @mentions to notify specific team members</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 