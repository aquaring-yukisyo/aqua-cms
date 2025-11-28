import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

// 完全な静的生成
export const dynamic = 'force-static';

export const metadata = {
  title: "会社情報 | AQUA CMS",
  description: "株式会社アクアリングの会社情報・企業理念・役員紹介",
};

export default function CompanyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* ヒーローセクション */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              会社情報
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Company Information
            </p>
          </div>
        </div>

        {/* 企業理念セクション */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Oneness for good design.
                </h2>
                <p className="text-xl text-gray-700 font-medium">
                  仲間となって未来の輪郭をデザインする
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="p-6 bg-primary-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    いいモノをつくる
                  </h3>
                </div>

                <div className="p-6 bg-secondary-50 rounded-xl">
                  <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    チームの力を信じる
                  </h3>
                </div>

                <div className="p-6 bg-accent-50 rounded-xl">
                  <div className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    理想へ背伸びをする
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 会社概要セクション */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                会社概要
              </h2>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                        会社名
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        株式会社アクアリング
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        創業
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        1998年7月1日
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        設立
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        2000年7月4日
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        資本金
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        25,002,880円
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        従業員数
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        84名
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        株主
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        中京テレビ放送株式会社
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        グループ会社
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>AQUARING Global Strategy</li>
                          <li>カエルエックス</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 役員紹介セクション */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                役員紹介
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">代表取締役社長</p>
                  <h3 className="text-lg font-bold text-gray-900">茂森 仙直</h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">代表取締役副社長</p>
                  <h3 className="text-lg font-bold text-gray-900">飯田 勝人</h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">取締役副社長</p>
                  <h3 className="text-lg font-bold text-gray-900">藤井 英一</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* アクセスセクション */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                アクセス
              </h2>

              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      本社所在地
                    </h3>
                    <p className="text-gray-700 mb-4">
                      〒460-0008<br />
                      愛知県名古屋市中区栄3-19-8<br />
                      栄ミナミ平和ビル6,7F
                    </p>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      TEL: 052-249-7700
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      交通アクセス
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        地下鉄名城線「矢場町駅」徒歩5分
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        地下鉄東山線・名城線「栄駅」徒歩8分
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 地図エリア */}
                <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    Google Mapsで見る
                  </p>
                  <a
                    href="https://maps.google.com/?q=愛知県名古屋市中区栄3-19-8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    地図を開く →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              最新のお知らせをチェック
            </h2>
            <p className="text-lg mb-8 opacity-90">
              アクアリングの最新情報をお届けします
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              お知らせ一覧へ
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

