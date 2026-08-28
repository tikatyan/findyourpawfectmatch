"use client"

import { quizContent, type Language, type ResultKey } from "@/data/quiz"
import { useState, use, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import posthog from "posthog-js"

export default function HomePage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = use(params)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<ResultKey | null>(null)

  // ✅ USE DATA FROM quiz.ts
  const content = quizContent[lang]
  const quizQuestions = content.questions.map((q, index) => ({
    id: index + 1,
    question: q.question,
    subtitle: q.subtitle,
    options: q.options,
    scoringMatrix: q.scoringMatrix
  }))
  const resultTypes = content.results

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    // Capture the answer the user committed to for this question. Fired on
    // advance (not on selection) so changing your mind first isn't counted.
    const selectedValue = answers[quizQuestions[currentQuestion].id]
    const selectedOption = quizQuestions[currentQuestion].options.find(
      (o) => o.value === selectedValue,
    )
    posthog.capture("quiz_answer_selected", {
      question_number: currentQuestion + 1,
      answer: selectedOption?.label ?? selectedValue,
      answer_value: selectedValue,
      language: lang,
    })

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResult = () => {
    const scores = { low: 0, medium: 0, high: 0 }
    let redFlagCount = 0

    // Calculate scores AND count red flags
    quizQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (question.scoringMatrix && answer) {
        const scoreData = question.scoringMatrix[answer]
        if (scoreData) {
          scores.low += scoreData.low
          scores.medium += scoreData.medium
          scores.high += scoreData.high
          
          // Check if this answer is a red flag
          if (scoreData.isRedflag) {
            redFlagCount++
          }
        }
      }
    })

    // Determine result based on highest score
    const maxScore = Math.max(scores.low, scores.medium, scores.high)

    // Check red flags and minimum score
    let resultKey: ResultKey
    if (redFlagCount >= 3 || maxScore < 6) {
      resultKey = "notReady"
    } else if (scores.high === maxScore) {
      resultKey = "highEnergy"
    } else if (scores.medium === maxScore) {
      resultKey = "mediumEnergy"
    } else {
      resultKey = "lowEnergy"
    }

    posthog.capture("quiz_completed", { result: resultKey, language: lang })

    setResult(resultKey)
    setShowResult(true)
  }

  const restartQuiz = () => {
    posthog.capture("quiz_retake_clicked", { from_result: result, language: lang })
    // Also emitted as a CTA so every result-page button is comparable in one
    // breakdown; quiz_retake_clicked is kept for the existing dashboard tile.
    posthog.capture("result_cta_clicked", { result, cta: "retake", language: lang })

    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setResult(null)
  }

  // Fire one event per question reached so PostHog can build a step-by-step
  // drop-off funnel (question 1 -> ... -> last question -> quiz_completed).
  useEffect(() => {
    if (showResult) return
    posthog.capture("quiz_question_viewed", {
      question_number: currentQuestion + 1,
      total_questions: quizQuestions.length,
      language: lang,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, showResult])

  // Mirror quiz progress into a ref so the unload handler below always reads
  // current values instead of the state captured when it was registered.
  const quizProgress = useRef({ currentQuestion, showResult, started: false })
  quizProgress.current = {
    currentQuestion,
    showResult,
    started: currentQuestion > 0 || Object.keys(answers).length > 0,
  }

  // Fire when someone leaves mid-quiz (started but never reached a result).
  // sendBeacon is used because normal XHR is routinely killed during unload.
  useEffect(() => {
    const handleUnload = () => {
      const { currentQuestion: q, showResult: done, started } = quizProgress.current
      if (!started || done) return
      posthog.capture(
        "quiz_abandoned",
        { last_question_seen: q + 1, total_questions: quizQuestions.length, language: lang },
        { transport: "sendBeacon" },
      )
    }

    window.addEventListener("beforeunload", handleUnload)
    // pagehide also covers mobile Safari / bfcache, where beforeunload often
    // never fires — without it most mobile abandonment would go unrecorded.
    window.addEventListener("pagehide", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      window.removeEventListener("pagehide", handleUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  if (showResult && result) {
    const resultData = resultTypes[result]

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="max-w-4xl mx-auto">
            <Card className={`border-2 rounded-2xl ${resultData.color} shadow-lg`}>
              <CardContent className="p-4 md:p-8">
                <div className="mb-4 md:mb-6">
                  <img
                    src={resultData.image || "/placeholder.png"}
                    alt={resultData.title}
                    className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-xl shadow-md"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-center">{resultData.title}</h2>
                <p className="text-base md:text-lg mb-6 md:mb-8 leading-relaxed text-center max-w-3xl mx-auto">{resultData.description}</p>

                {result === "notReady" ? (
                  <div className="space-y-8">
                    <div className="bg-white/50 rounded-xl p-6 max-w-2xl mx-auto">
                      <h3 className="font-semibold mb-4 text-xl text-center md:text-left">
                        {lang === "en" ? "Next Steps:" : "Langkah Selanjutnya:"}
                      </h3>
                      <ul className="space-y-3">
                        {resultData.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-3 mt-1 flex-shrink-0 text-lg">✓</span>
                            <span className="text-sm leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 text-xl">
                          {lang === "en" ? "What This Means for You:" : "Karakteristik:"}
                        </h3>
                        <ul className="space-y-3">
                          {resultData.characteristics.map((char, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-500 mr-3 mt-1 flex-shrink-0">•</span>
                              <span className="text-sm leading-relaxed">{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 text-xl">
                          {lang === "en" ? "Examples of Ideal Dogs:" : "Contoh Tipe Doggo:"}
                        </h3>
                        <ul className="space-y-3">
                          {resultData.examples?.map((example, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-3 mt-1 flex-shrink-0">🐕</span>
                              <span className="text-sm leading-relaxed">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {resultData.keepInMind && (
                      <div className="bg-white/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 text-xl">
                          {lang === "en" ? "Things to Keep in Mind:" : "Perlu Diingat:"}
                        </h3>
                        <ul className="space-y-3">
                          {resultData.keepInMind.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-3 mt-1 flex-shrink-0">💡</span>
                              <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-white/50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-xl">
                        {lang === "en" ? "Next Steps:" : "Langkah Selanjutnya:"}
                      </h3>
                      <ul className="space-y-3">
                        {resultData.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                            <span className="text-sm leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 pt-8 border-t border-white/30">
                  <Link href={`/${lang}/find-shelter`}>
                    <Button
                      variant="outline"
                      onClick={() =>
                        posthog.capture("result_cta_clicked", {
                          result,
                          cta: "find_shelter",
                          language: lang,
                        })
                      }
                      className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-full font-semibold text-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      {lang === "en" ? "Find Local Shelters" : "Cari Shelter Terdekat"}
                    </Button>
                  </Link>
                  <Button
                    onClick={restartQuiz}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 px-6 py-4 rounded-full font-medium hover:bg-white/50 transition-all"
                  >
                    {lang === "en" ? "Take Quiz Again" : "Ulangi Kuis"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">{content.quizTitle}</h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">{content.description}</p>
          </div>

          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {lang === "en" ? "Question" : "Pertanyaan"} {currentQuestion + 1}{" "}
                {lang === "en" ? "of" : "dari"} {quizQuestions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% {lang === "en" ? "complete" : "selesai"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardContent className="p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">{question.question}</h2>
              {question.subtitle && <p className="text-gray-600 text-center mb-4 md:mb-6 italic text-sm md:text-base">{question.subtitle}</p>}

              <div className="space-y-3 md:space-y-4">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`w-full p-3 md:p-4 text-left rounded-xl border-2 transition-all hover:shadow-md ${
                      answers[question.id] === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <span className="text-gray-800">{option.label}</span>
                  </button>
                ))}
              </div>

             <div className="flex justify-between mt-6 md:mt-8">
                <Button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {lang === "en" ? "Previous" : "Sebelumnya"}
                </Button>

                <Button
                  onClick={nextQuestion}
                  disabled={!answers[question.id]}
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                >
                  {currentQuestion === quizQuestions.length - 1
                    ? lang === "en"
                      ? "Get My Result!"
                      : "Lihat Hasilku!"
                    : lang === "en"
                      ? "Next"
                      : "Selanjutnya"}
                  {currentQuestion !== quizQuestions.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
