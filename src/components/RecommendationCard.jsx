import React from "react";
import { ShieldCheck, Home, Brain, Bot, DollarSign } from "lucide-react";

function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;
  const name = recommendation.product || "Unknown System";
  const reason= recommendation.reason || "Unknown Reason";

  return (
    <div className="bg-white rounded-xl shadow-md border border-green-200 p-4 mt-4">
      <div className="flex items-center mb-2 text-green-600 font-semibold text-lg">
        <ShieldCheck className="mr-2" />
        Your Personalized Security Recommendation
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <Bot className="text-blue-500" />
        <span className="text-gray-800 font-medium">{name}</span>
        
      </div>
      <span className="text-gray-800 font-medium mb-2">{reason}</span>
      
      
      <p className=" flex text-gray-800 mt-2 ">
        <DollarSign className="text-yellow-500" />
         Estimated Cost: <span className="font-semibold">{recommendation.price}</span>
      </p>
      {recommendation.description && (
        <p className="text-gray-500 mt-2 text-sm">{recommendation.description}</p>
      )}
    </div>
  );
}

export default RecommendationCard;