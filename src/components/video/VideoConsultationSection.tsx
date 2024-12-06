@@ .. @@
   return (
     <div className="space-y-6">
       {activeSession ? (
-        <DailyProvider url={`https://lawlink.daily.co/${activeSession}`}>
+        <DailyProvider
+          url={`https://lawlink.daily.co/${activeSession}`}
+          subscribeToTracksAutomatically
+          videoSource={{ facingMode: 'user' }}
+          audioSource={true}
+        >
           <VideoRoom
             sessionId={activeSession}
             userName={userType === 'client' ? 'Client User' : 'Legal Consultant'}
             onLeave={() => setActiveSession(null)}
             onError={(error) => {
               addToast(error.message, 'error');
               setActiveSession(null);
             }}
           />
         </DailyProvider>