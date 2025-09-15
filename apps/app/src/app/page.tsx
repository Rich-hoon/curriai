import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-5xl font-bold text-white mb-6">
            🎉 Curri.AI 배포 성공!
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            웹사이트가 정상적으로 배포되었습니다.
          </p>
          <div className="space-y-4">
            <Link 
              href="/ko" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
            >
              한국어 버전
            </Link>
            <Link 
              href="/en" 
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              English Version
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
