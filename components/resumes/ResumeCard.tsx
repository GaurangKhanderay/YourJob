"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Trash2, Eye, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Resume } from "@/lib/types";
import { formatDate, getScoreColor, getScoreBgColor } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

interface ResumeCardProps {
  resume: Resume;
  showActions?: boolean;
}

export function ResumeCard({ resume, showActions = true }: ResumeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteResume = useMutation(api.resumes.deleteResume);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    setIsDeleting(true);
    try {
      await deleteResume({ resumeId: resume._id });
      toast.success("Resume deleted successfully");
    } catch (error) {
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    // Create a temporary link to download the file
    const link = document.createElement("a");
    link.href = resume.fileUrl;
    link.download = resume.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{resume.fileName}</h3>
            <p className="text-sm text-gray-600">
              Uploaded {formatDate(resume.uploadedAt)}
            </p>
          </div>
        </div>
        {showActions && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {resume.analysis ? (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getScoreBgColor(resume.analysis.score)} ${getScoreColor(resume.analysis.score)}`}>
              <Star className="h-5 w-5 mr-2" />
              {resume.analysis.score}/100
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getScoreLabel(resume.analysis.score)}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{resume.analysis.clarity}</div>
              <div className="text-xs text-gray-600">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{resume.analysis.keywords}</div>
              <div className="text-xs text-gray-600">Keywords</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{resume.analysis.atsCompatibility}</div>
              <div className="text-xs text-gray-600">ATS Score</div>
            </div>
          </div>

          {/* Key Feedback */}
          {resume.analysis.feedback.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Feedback</h4>
              <ul className="space-y-1">
                {resume.analysis.feedback.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {resume.analysis.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestions</h4>
              <ul className="space-y-1">
                {resume.analysis.suggestions.slice(0, 2).map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button className="btn-outline w-full text-sm">
              <Eye className="h-4 w-4 mr-2" />
              View Full Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Analyzing resume...</p>
        </div>
      )}
    </motion.div>
  );
}
