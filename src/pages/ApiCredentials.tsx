
import React from "react";
import ZoraAPICredentialsForm from "@/components/ZoraAPICredentialsForm";

const ApiCredentials = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">API Credentials Setup</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <ZoraAPICredentialsForm />
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">How to Get API Keys</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Zora API</h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Visit the <a href="https://zora.co/docs/developers/apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Zora Developer Portal</a></li>
              <li>Create an account or sign in if you already have one</li>
              <li>Navigate to the API Keys section</li>
              <li>Create a new API key for your application</li>
              <li>Copy the API key and paste it in the form above</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Farcaster API (via Neynar)</h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Visit <a href="https://neynar.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Neynar</a></li>
              <li>Create an account or sign in</li>
              <li>Navigate to the API Keys or Developer Dashboard section</li>
              <li>Create a new API key for your application</li>
              <li>Copy the API key and paste it in the form above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiCredentials;
