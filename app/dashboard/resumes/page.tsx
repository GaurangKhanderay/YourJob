"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Star,
  Plus,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";

interface Resume {
  _id: Id<"resumes">;
  fileName: string;
  fileUrl: string;
  uploadedAt: number;
  analysis?: {
    score: number;
    clarity: number;
    keywords: number;
    atsCompatibility: number;
    feedback: string[];
    suggestions: string[];
    analyzedAt: number;
  };
}

export default function ResumesPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumes = useQuery(api.resumes.getUserResumes, {});
  const uploadResume = useMutation(api.resumes.uploadResume);
  const deleteResume = useMutation(api.resumes.deleteResume);
  const analyzeResume = useMutation(api.resumeAnalysis.analyzeResume);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // In a real app, you'd upload to a file storage service
      const fileUrl = URL.createObjectURL(uploadedFile);
      
      await uploadResume({
        fileName: uploadedFile.name,
        fileUrl,
        content: "Mock resume content for analysis", // In real app, extract text from PDF
      });

      toast.success("Resume uploaded successfully!");
      setShowUploadModal(false);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resumeId: Id<"resumes">) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume({ resumeId });
        toast.success("Resume deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete resume");
      }
    }
  };

  const handleAnalyze = async (resumeId: Id<"resumes">) => {
    try {
      await analyzeResume({ 
        resumeId, 
        content: "Mock resume content for analysis" 
      });
      toast.success("Resume analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze resume");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
              <p className="text-gray-600">Upload, analyze, and manage your resumes</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Upload Resume
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{resumes?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resumes?.filter(r => r.analysis).length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resumes && resumes.filter(r => r.analysis).length > 0
                    ? Math.round(
                        resumes
                          .filter(r => r.analysis)
                          .reduce((sum, r) => sum + (r.analysis?.score || 0), 0) /
                        resumes.filter(r => r.analysis).length
                      )
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resumes && resumes.length > 0
                    ? Math.max(...(resumes.map(r => r.analysis?.score || 0)))
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes?.map((resume, index) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {resume.fileName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {resume.analysis ? (
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBg(resume.analysis.score)}`}>
                      <span className={`text-2xl font-bold ${getScoreColor(resume.analysis.score)}`}>
                        {resume.analysis.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Overall Score</p>
                  </div>

                  {/* Detailed Scores */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Clarity</span>
                      <span className="font-medium">{resume.analysis.clarity}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${resume.analysis.clarity}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Keywords</span>
                      <span className="font-medium">{resume.analysis.keywords}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${resume.analysis.keywords}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ATS Compatible</span>
                      <span className="font-medium">{resume.analysis.atsCompatibility}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${resume.analysis.atsCompatibility}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Feedback */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Quick Feedback</h4>
                    <div className="space-y-1">
                      {resume.analysis.feedback.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="text-xs text-gray-600 flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">Not analyzed yet</p>
                  <button
                    onClick={() => handleAnalyze(resume._id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    Analyze Resume
                  </button>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {resumes?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded</h3>
            <p className="text-gray-600 mb-4">Upload your first resume to get started with AI analysis</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Upload Resume
            </button>
          </motion.div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Resume</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {uploadedFile && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Selected:</strong> {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadedFile || isUploading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}