'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, Download, Trash2, Eye, File, Image, Video, Music, Archive, FileText, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
  url: string
  thumbnail?: string
}

const mockAttachments: Attachment[] = [
  {
    id: '1',
    name: 'screenshot.png',
    size: 245760,
    type: 'image/png',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-15T10:30:00Z',
    url: '/files/screenshot.png',
    thumbnail: '/thumbnails/screenshot.png'
  },
  {
    id: '2',
    name: 'error-log.txt',
    size: 15360,
    type: 'text/plain',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-01-15T09:15:00Z',
    url: '/files/error-log.txt'
  },
  {
    id: '3',
    name: 'presentation.pdf',
    size: 2048576,
    type: 'application/pdf',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-14T16:45:00Z',
    url: '/files/presentation.pdf'
  },
  {
    id: '4',
    name: 'video-demo.mp4',
    size: 15728640,
    type: 'video/mp4',
    uploadedBy: 'Sarah Wilson',
    uploadedAt: '2024-01-14T14:20:00Z',
    url: '/files/video-demo.mp4',
    thumbnail: '/thumbnails/video-demo.png'
  }
]

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="h-5 w-5" />
  if (type.startsWith('video/')) return <Video className="h-5 w-5" />
  if (type.startsWith('audio/')) return <Music className="h-5 w-5" />
  if (type.includes('pdf')) return <FileText className="h-5 w-5" />
  if (type.includes('zip') || type.includes('rar')) return <Archive className="h-5 w-5" />
  return <File className="h-5 w-5" />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function TicketAttachments() {
  const params = useParams()
  const ticketId = params.id as string
  const [attachments, setAttachments] = useState<Attachment[]>(mockAttachments)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const handleFileUpload = async () => {
    if (!selectedFiles) return
    
    setIsUploading(true)
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add new attachments to the list
    const newAttachments: Attachment[] = Array.from(selectedFiles).map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }))
    
    setAttachments(prev => [...newAttachments, ...prev])
    setSelectedFiles(null)
    setIsUploading(false)
  }

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const handleDownload = (attachment: Attachment) => {
    // Simulate download
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
              <h1 className="text-2xl font-bold text-white">Ticket Attachments</h1>
              <p className="text-gray-400">Manage files and documents for ticket #{ticketId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Upload Section */}
        {selectedFiles && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{file.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={handleFileUpload} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedFiles(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attachments List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Attachments ({attachments.length})</span>
              <Badge variant="secondary">{formatFileSize(attachments.reduce((sum, att) => sum + att.size, 0))}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(attachment.type)}
                      <div>
                        <p className="text-white font-medium">{attachment.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{formatFileSize(attachment.size)}</span>
                          <span>•</span>
                          <span>Uploaded by {attachment.uploadedBy}</span>
                          <span>•</span>
                          <span>{formatDate(attachment.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(attachment.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {attachments.length === 0 && (
                <div className="text-center py-8">
                  <File className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No attachments uploaded yet</p>
                  <p className="text-gray-500 text-sm">Upload files to help with ticket resolution</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Types Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Supported File Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-400">Images (PNG, JPG, GIF)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">Videos (MP4, AVI, MOV)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-400">Documents (PDF, DOC, TXT)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Archive className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-400">Archives (ZIP, RAR)</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Maximum file size: 50MB per file. Total storage limit: 1GB per ticket.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 