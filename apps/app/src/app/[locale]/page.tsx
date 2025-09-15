export default function LocalePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            🚀 Curri.AI
          </h1>
          <p className="text-2xl text-gray-200 mb-8">
            AI 학습 플랫폼
          </p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI가 자동 생성한 커리큘럼으로 학습하세요!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">AI 커리큘럼 자동 생성</h3>
            <p className="text-gray-300">목표를 입력하면 AI가 맞춤형 학습 계획을 만들어드립니다</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">학습 진도율 시각화</h3>
            <p className="text-gray-300">체계적인 진도 관리로 학습 성과를 한눈에 확인하세요</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-white mb-2">GitHub 스타일 잔디 그래프</h3>
            <p className="text-gray-300">일일 학습 기록을 시각적으로 관리하고 동기부여를 받으세요</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">커리큘럼 포크 & 공유</h3>
            <p className="text-gray-300">다른 사용자의 커리큘럼을 포크하고 나만의 학습 계획을 세우세요</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
            지금 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
