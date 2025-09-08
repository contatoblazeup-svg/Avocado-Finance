"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, CheckCircle, Droplets, X, Calendar, ThumbsUp, ThumbsDown, Meh } from "lucide-react"

interface QuizData {
  gender: string
  bodyType: string
  goal: string
  subGoal: string
  bodyFat: number
  problemAreas: string[]
  diet: string
  sugarFrequency: string
  waterIntake: string
  height: string
  heightUnit: string
  currentWeight: string
  targetWeight: string
  weightUnit: string
  timeToGoal: string
  name: string
  importantEvent: string
  eventDate: string
  workoutTime: string
  experience: string
  equipment: string[]
  exercisePreferences: {
    cardio: string
    pullups: string
    weights: string
    yoga: string
  }
  email: string
}

const initialQuizData: QuizData = {
  gender: "",
  bodyType: "",
  goal: "",
  subGoal: "",
  bodyFat: 15,
  problemAreas: [],
  diet: "",
  sugarFrequency: "",
  waterIntake: "",
  height: "",
  heightUnit: "cm",
  currentWeight: "",
  targetWeight: "",
  weightUnit: "kg",
  timeToGoal: "",
  name: "",
  importantEvent: "",
  eventDate: "",
  workoutTime: "",
  experience: "",
  equipment: [],
  exercisePreferences: {
    cardio: "",
    pullups: "",
    weights: "",
    yoga: "",
  },
  email: "",
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showNutritionInfo, setShowNutritionInfo] = useState(false)
  const [showWaterCongrats, setShowWaterCongrats] = useState(false)
  const [showTimeCalculation, setShowTimeCalculation] = useState(false)
  const totalSteps = 23

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData((prev) => ({ ...prev, [field]: value }))
  }

  const updateExercisePreference = (exercise: string, preference: string) => {
    setQuizData((prev) => ({
      ...prev,
      exercisePreferences: {
        ...prev.exercisePreferences,
        [exercise]: preference,
      },
    }))
  }

  const handleArrayUpdate = (field: keyof QuizData, value: string, checked: boolean) => {
    setQuizData((prev) => {
      const currentArray = prev[field] as string[]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) }
      }
    })
  }

  const calculateTimeToGoal = () => {
    const current = Number.parseFloat(quizData.currentWeight)
    const target = Number.parseFloat(quizData.targetWeight)

    if (!current || !target) return ""

    const weightDifference = Math.abs(current - target)
    const weeksNeeded = Math.ceil(weightDifference / 0.75) // 0.75kg por semana é saudável

    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + weeksNeeded * 7)

    const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

    const day = targetDate.getDate()
    const month = months[targetDate.getMonth()]
    const year = targetDate.getFullYear()

    return `${day} de ${month}. de ${year}`
  }

  const nextStep = () => {
    if (currentStep === 4 && quizData.goal && !quizData.subGoal) {
      // Vai para sub-objetivo
      setCurrentStep(5)
    } else if (currentStep === 7 && quizData.diet !== "nao-sigo") {
      setShowNutritionInfo(true)
      setTimeout(() => {
        setShowNutritionInfo(false)
        setCurrentStep(currentStep + 1)
      }, 3000)
    } else if (currentStep === 9 && quizData.waterIntake === "mais-10") {
      setShowWaterCongrats(true)
      setTimeout(() => {
        setShowWaterCongrats(false)
        setCurrentStep(currentStep + 1)
      }, 3000)
    } else if (currentStep === 12) {
      // Calcular tempo após inserir peso alvo
      const timeToGoal = calculateTimeToGoal()
      updateQuizData("timeToGoal", timeToGoal)

      if (timeToGoal) {
        setShowTimeCalculation(true)
        setTimeout(() => {
          setShowTimeCalculation(false)
          setCurrentStep(currentStep + 1)
        }, 4000)
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else if (currentStep === 13) {
      // Se escolheu um evento importante, vai para a pergunta da data
      if (quizData.importantEvent !== "nenhum") {
        setCurrentStep(14)
      } else {
        // Se escolheu "nenhum evento especial", pula a pergunta da data
        setCurrentStep(15)
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      if (currentStep === 5 && quizData.goal) {
        // Volta para objetivo principal
        setCurrentStep(4)
      } else if (currentStep === 14) {
        setCurrentStep(13)
      } else if (currentStep === 15 && quizData.importantEvent !== "nenhum") {
        setCurrentStep(14)
      } else {
        setCurrentStep(currentStep - 1)
      }
    }
  }

  const handleSubmit = () => {
    console.log("Quiz completed:", quizData)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      window.location.href = "/quiz/results"
    }, 2000)
  }

  // Body illustration component with realistic AI images
  const BodyIllustration = ({
    type = "normal",
    highlightAreas = [],
    className = "w-32 h-48",
    gender = "male",
  }: {
    type?: string
    highlightAreas?: string[]
    className?: string
    gender?: string
  }) => {
    const getBodyImage = () => {
      if (type === "ectomorfo") {
        return gender === "female" ? "/images/female-ectomorph.png" : "/images/male-ectomorph.png"
      }
      if (type === "mesomorfo") {
        return gender === "female" ? "/images/female-mesomorph.png" : "/images/male-mesomorph.png"
      }
      if (type === "endomorfo") {
        return gender === "female" ? "/images/female-endomorph.png" : "/images/male-endomorph.png"
      }
      // Default body type
      return gender === "female" ? "/images/female-mesomorph.png" : "/images/male-mesomorph.png"
    }

    return (
      <div className={`${className} relative`}>
        <img
          src={getBodyImage() || "/placeholder.svg"}
          alt={`${gender} ${type} body type`}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback para SVG se a imagem não carregar
            e.currentTarget.style.display = "none"
            e.currentTarget.nextElementSibling.style.display = "block"
          }}
        />

        {/* SVG Fallback */}
        <svg viewBox="0 0 100 150" className="w-full h-full" style={{ display: "none" }}>
          <path
            d="M50 10 C45 10 40 15 40 25 L40 35 C35 40 35 50 40 55 L40 90 C40 95 35 100 30 105 L30 140 C30 145 35 150 40 150 L60 150 C65 150 70 145 70 140 L70 105 C65 100 60 95 60 90 L60 55 C65 50 65 40 60 35 L60 25 C60 15 55 10 50 10 Z"
            fill="#D4A574"
            stroke="#B8956A"
            strokeWidth="1"
          />
          <circle cx="50" cy="20" r="12" fill="#D4A574" stroke="#B8956A" strokeWidth="1" />
          <ellipse cx="25" cy="45" rx="8" ry="20" fill="#D4A574" stroke="#B8956A" strokeWidth="1" />
          <ellipse cx="75" cy="45" rx="8" ry="20" fill="#D4A574" stroke="#B8956A" strokeWidth="1" />
          <rect x="35" y="85" width="30" height="20" rx="3" fill="#4A90A4" />
        </svg>

        {/* Overlay for highlighting problem areas */}
        {highlightAreas.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {highlightAreas.map((area) => (
              <div
                key={area}
                className="absolute bg-orange-500 bg-opacity-30 rounded-full animate-pulse"
                style={{
                  // Position overlays based on body area
                  ...(area === "Peito" && { top: "25%", left: "35%", width: "30%", height: "15%" }),
                  ...(area === "Braços" && { top: "20%", left: "10%", width: "20%", height: "40%" }),
                  ...(area === "Barriga" && { top: "45%", left: "30%", width: "40%", height: "20%" }),
                  ...(area === "Pernas" && { top: "65%", left: "25%", width: "50%", height: "35%" }),
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Exercise illustration component with realistic AI images
  const ExerciseIllustration = ({ type, className = "w-full h-48" }: { type: string; className?: string }) => {
    const getExerciseImage = () => {
      switch (type) {
        case "cardio":
          return "/images/cardio-exercise.png"
        case "pullups":
          return "/images/pullups-exercise.png"
        case "weights":
          return "/images/weights-exercise.png"
        case "yoga":
          return "/images/yoga-exercise.png"
        default:
          return "/images/cardio-exercise.png"
      }
    }

    const getSVGFallback = () => {
      const illustrations = {
        cardio: (
          <svg viewBox="0 0 200 200" className={className}>
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="100%" stopColor="#B8956A" />
              </linearGradient>
            </defs>
            {/* Corpo correndo */}
            <ellipse cx="100" cy="40" rx="15" ry="18" fill="url(#bodyGradient)" />
            <circle cx="100" cy="25" r="12" fill="url(#bodyGradient)" />
            <rect x="85" y="55" width="30" height="40" rx="15" fill="url(#bodyGradient)" />
            {/* Braços em movimento */}
            <ellipse cx="70" cy="65" rx="8" ry="20" fill="url(#bodyGradient)" transform="rotate(-30 70 65)" />
            <ellipse cx="130" cy="65" rx="8" ry="20" fill="url(#bodyGradient)" transform="rotate(30 130 65)" />
            {/* Pernas correndo */}
            <ellipse cx="90" cy="120" rx="8" ry="25" fill="url(#bodyGradient)" transform="rotate(-20 90 120)" />
            <ellipse cx="110" cy="120" rx="8" ry="25" fill="url(#bodyGradient)" transform="rotate(20 110 120)" />
            {/* Shorts */}
            <rect x="85" y="85" width="30" height="20" rx="3" fill="#4A90A4" />
            {/* Tênis */}
            <ellipse cx="85" cy="155" rx="12" ry="6" fill="#FF4500" />
            <ellipse cx="115" cy="155" rx="12" ry="6" fill="#FF4500" />
            {/* Linhas de movimento */}
            <path d="M 60 80 Q 50 85 55 90" stroke="#FFA500" strokeWidth="2" fill="none" />
            <path d="M 140 80 Q 150 85 145 90" stroke="#FFA500" strokeWidth="2" fill="none" />
          </svg>
        ),
        pullups: (
          <svg viewBox="0 0 200 200" className={className}>
            <defs>
              <linearGradient id="bodyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="100%" stopColor="#B8956A" />
              </linearGradient>
            </defs>
            {/* Barra */}
            <rect x="50" y="20" width="100" height="8" rx="4" fill="#666" />
            {/* Corpo na barra */}
            <circle cx="100" cy="45" r="12" fill="url(#bodyGradient2)" />
            <rect x="85" y="55" width="30" height="50" rx="15" fill="url(#bodyGradient2)" />
            {/* Braços segurando a barra */}
            <ellipse cx="80" cy="40" rx="6" ry="18" fill="url(#bodyGradient2)" />
            <ellipse cx="120" cy="40" rx="6" ry="18" fill="url(#bodyGradient2)" />
            {/* Pernas dobradas */}
            <ellipse cx="90" cy="130" rx="8" ry="20" fill="url(#bodyGradient2)" transform="rotate(20 90 130)" />
            <ellipse cx="110" cy="130" rx="8" ry="20" fill="url(#bodyGradient2)" transform="rotate(-20 110 130)" />
            {/* Shorts */}
            <rect x="85" y="95" width="30" height="20" rx="3" fill="#4A90A4" />
            {/* Tênis */}
            <ellipse cx="85" cy="155" rx="10" ry="5" fill="#FF4500" />
            <ellipse cx="115" cy="155" rx="10" ry="5" fill="#FF4500" />
          </svg>
        ),
        weights: (
          <svg viewBox="0 0 200 200" className={className}>
            <defs>
              <linearGradient id="bodyGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="100%" stopColor="#B8956A" />
              </linearGradient>
            </defs>
            {/* Corpo agachando */}
            <circle cx="100" cy="35" r="12" fill="url(#bodyGradient3)" />
            <rect x="85" y="45" width="30" height="40" rx="15" fill="url(#bodyGradient3)" />
            {/* Braços segurando halteres */}
            <ellipse cx="70" cy="65" rx="8" ry="18" fill="url(#bodyGradient3)" />
            <ellipse cx="130" cy="65" rx="8" ry="18" fill="url(#bodyGradient3)" />
            {/* Pernas agachadas */}
            <ellipse cx="90" cy="110" rx="10" ry="25" fill="url(#bodyGradient3)" />
            <ellipse cx="110" cy="110" rx="10" ry="25" fill="url(#bodyGradient3)" />
            {/* Shorts */}
            <rect x="85" y="75" width="30" height="20" rx="3" fill="#4A90A4" />
            {/* Halteres */}
            <rect x="55" y="75" width="20" height="6" rx="3" fill="#333" />
            <rect x="125" y="75" width="20" height="6" rx="3" fill="#333" />
            <circle cx="60" cy="78" r="5" fill="#666" />
            <circle cx="70" cy="78" r="5" fill="#666" />
            <circle cx="130" cy="78" r="5" fill="#666" />
            <circle cx="140" cy="78" r="5" fill="#666" />
            {/* Tênis */}
            <ellipse cx="85" cy="145" rx="12" ry="6" fill="#FF4500" />
            <ellipse cx="115" cy="145" rx="12" ry="6" fill="#FF4500" />
          </svg>
        ),
        yoga: (
          <svg viewBox="0 0 200 200" className={className}>
            <defs>
              <linearGradient id="bodyGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="100%" stopColor="#B8956A" />
              </linearGradient>
            </defs>
            {/* Tapete de yoga */}
            <rect x="40" y="140" width="120" height="8" rx="4" fill="#8B4513" />
            {/* Corpo em posição de meditação */}
            <circle cx="100" cy="60" r="12" fill="url(#bodyGradient4)" />
            <rect x="85" y="70" width="30" height="35" rx="15" fill="url(#bodyGradient4)" />
            {/* Braços em posição de oração */}
            <ellipse cx="85" cy="85" rx="6" ry="15" fill="url(#bodyGradient4)" transform="rotate(-20 85 85)" />
            <ellipse cx="115" cy="85" rx="6" ry="15" fill="url(#bodyGradient4)" transform="rotate(20 115 85)" />
            {/* Pernas cruzadas */}
            <ellipse cx="85" cy="120" rx="12" ry="8" fill="url(#bodyGradient4)" transform="rotate(30 85 120)" />
            <ellipse cx="115" cy="120" rx="12" ry="8" fill="url(#bodyGradient4)" transform="rotate(-30 115 120)" />
            {/* Shorts */}
            <rect x="85" y="95" width="30" height="15" rx="3" fill="#4A90A4" />
            {/* Mãos em oração */}
            <circle cx="100" cy="80" r="3" fill="#D4A574" />
            {/* Elementos zen */}
            <circle cx="60" cy="50" r="2" fill="#FFA500" opacity="0.7" />
            <circle cx="140" cy="45" r="2" fill="#FFA500" opacity="0.7" />
            <circle cx="70" cy="40" r="1.5" fill="#FFA500" opacity="0.5" />
          </svg>
        ),
      }
      return illustrations[type as keyof typeof illustrations]
    }

    return (
      <div className="flex justify-center">
        <img
          src={getExerciseImage() || "/placeholder.svg"}
          alt={`${type} exercise`}
          className={`${className} object-contain`}
          onError={(e) => {
            // Fallback para SVG se a imagem não carregar
            e.currentTarget.style.display = "none"
            e.currentTarget.nextElementSibling.style.display = "block"
          }}
        />

        {/* SVG Fallback */}
        <div style={{ display: "none" }}>{getSVGFallback()}</div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <div className="bg-gray-800 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">Seu plano de treino personalizado está pronto!</h2>
          </div>
        </div>
      </div>
    )
  }

  if (showNutritionInfo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <BodyIllustration className="w-48 h-64 mx-auto" gender={quizData.gender === "mulher" ? "female" : "male"} />
          <h2 className="text-3xl font-bold">
            <span className="text-orange-600">81%</span> dos seus resultados são sobre nutrição
          </h2>
          <p className="text-gray-300 text-lg">Para obter os maiores ganhos em massa muscular e força, você precisa:</p>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-white">Total de calorias suficientes a cada dia.</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-white">Proteína adequada para realmente reconstruir mais tecido muscular.</p>
            </div>
          </div>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg rounded-full">
            Entendi
          </Button>
        </div>
      </div>
    )
  }

  if (showWaterCongrats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-32 h-32 mx-auto relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#374151" />
              <path d="M 50 5 A 45 45 0 0 1 95 50 L 50 50 Z" fill="#3B82F6" />
              <path d="M 50 5 A 45 45 0 1 1 20 80 L 50 50 Z" fill="#60A5FA" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">Uau! Impressionante!</h2>
          <p className="text-gray-300 text-lg">Você bebe mais água do que 92% dos usuários* Continue assim!</p>
          <p className="text-gray-500 text-sm">*Usuários do MadMuscles que fizeram o teste</p>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg rounded-full">
            Entendi
          </Button>
        </div>
      </div>
    )
  }

  if (showTimeCalculation) {
    const current = Number.parseFloat(quizData.currentWeight)
    const target = Number.parseFloat(quizData.targetWeight)

    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <h2 className="text-2xl font-bold">
            O último plano de que você precisará para <span className="text-orange-600">finalmente entrar</span> em
            forma
          </h2>

          <p className="text-gray-300">Com base em nossos cálculos, você atingirá seu peso ideal de {target} kg até</p>

          <div className="text-2xl font-bold text-orange-600 border-b-2 border-orange-600 pb-2 inline-block">
            {quizData.timeToGoal}
          </div>

          {/* Gráfico de progresso */}
          <div className="relative h-32 bg-gray-800 rounded-lg p-4">
            <div className="absolute top-4 left-4 bg-gray-700 px-3 py-1 rounded text-sm">{current} kg</div>
            <div className="absolute bottom-4 right-4 bg-orange-600 px-3 py-1 rounded text-sm">{target} kg</div>

            {/* Curva de progresso */}
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#FF6B35" />
                </linearGradient>
              </defs>
              <path d="M 20 20 Q 150 60 280 80" stroke="url(#progressGradient)" strokeWidth="4" fill="none" />
              <circle cx="20" cy="20" r="4" fill="#8B4513" />
              <circle cx="280" cy="80" r="4" fill="#FF6B35" />
            </svg>
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>10 de jun. de 2025</span>
            <span>{quizData.timeToGoal}</span>
          </div>

          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg rounded-full">
            Entendi
          </Button>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Gênero
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual o seu gênero?</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "homem", label: "Homem" },
                { value: "mulher", label: "Mulher" },
              ].map((gender) => (
                <div
                  key={gender.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
                    quizData.gender === gender.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("gender", gender.value)}
                >
                  <div className="text-center space-y-4">
                    <BodyIllustration
                      className="w-20 h-28 mx-auto"
                      gender={gender.value === "mulher" ? "female" : "male"}
                    />
                    <h3 className="text-xl font-bold text-white">{gender.label}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2: // Tipo de corpo
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual o seu tipo de Corpo?</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { value: "ectomorfo", label: "Ectomorfo", desc: "Corpo magro, dificuldade para ganhar peso" },
                { value: "mesomorfo", label: "Mesomorfo", desc: "Corpo atlético, facilidade para ganhar músculos" },
                { value: "endomorfo", label: "Endomorfo", desc: "Corpo mais largo, tendência a acumular gordura" },
              ].map((type) => (
                <div
                  key={type.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
                    quizData.bodyType === type.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("bodyType", type.value)}
                >
                  <div className="flex items-center space-x-4">
                    <BodyIllustration
                      type={type.value}
                      className="w-20 h-28"
                      gender={quizData.gender === "mulher" ? "female" : "male"}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{type.label}</h3>
                      <p className="text-gray-400">{type.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3: // Objetivo principal
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é o seu objetivo?</h2>
            </div>

            <div className="space-y-4">
              {[
                { value: "perder-peso", label: "Perder peso" },
                { value: "ganhar-massa", label: "Ganhar Massa Muscular" },
                { value: "ficar-musculoso", label: "Ficar Musculoso" },
              ].map((goal) => (
                <div
                  key={goal.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center justify-between ${
                    quizData.goal === goal.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("goal", goal.value)}
                >
                  <h3 className="text-xl font-bold text-white">{goal.label}</h3>
                  <BodyIllustration
                    type={goal.value}
                    className="w-16 h-20"
                    gender={quizData.gender === "mulher" ? "female" : "male"}
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case 4: // Sub-objetivo (condicional)
        const getSubGoals = () => {
          switch (quizData.goal) {
            case "perder-peso":
              return [
                { value: "corpo-esbelto", label: "Corpo esbelto", desc: "Magro e definido" },
                { value: "corpo-musculoso", label: "Corpo musculoso", desc: "Magro com músculos definidos" },
              ]
            case "ganhar-massa":
              return [
                { value: "atleta", label: "Atleta", desc: "Corpo atlético e funcional" },
                { value: "heroi", label: "Herói", desc: "Físico de super-herói" },
                { value: "fisiculturista", label: "Fisiculturista", desc: "Máximo desenvolvimento muscular" },
              ]
            case "ficar-musculoso":
              return [
                { value: "corpo-praia", label: "Corpo de praia", desc: "Definido para o verão" },
                { value: "corpo-treino", label: "Corpo de treino", desc: "Forte e musculoso" },
                { value: "corpo-crossfit", label: "Corpo de CrossFit", desc: "Funcional e resistente" },
              ]
            default:
              return []
          }
        }

        const subGoals = getSubGoals()

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Que tipo de resultado você quer?</h2>
            </div>

            <div className="space-y-4">
              {subGoals.map((subGoal) => (
                <div
                  key={subGoal.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
                    quizData.subGoal === subGoal.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("subGoal", subGoal.value)}
                >
                  <div className="flex items-center space-x-4">
                    <BodyIllustration
                      type={subGoal.value}
                      className="w-20 h-28"
                      gender={quizData.gender === "mulher" ? "female" : "male"}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{subGoal.label}</h3>
                      <p className="text-gray-400">{subGoal.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5: // Nível de gordura corporal
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Escolha o seu nível de gordura corporal</h2>
            </div>

            <div className="text-center space-y-8">
              <BodyIllustration
                className="w-32 h-40 mx-auto"
                gender={quizData.gender === "mulher" ? "female" : "male"}
              />

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-full px-4 py-2 inline-block">
                  <span className="text-white font-bold">{quizData.bodyFat}%</span>
                </div>

                <div className="px-4">
                  <Slider
                    value={[quizData.bodyFat]}
                    onValueChange={(value) => updateQuizData("bodyFat", value[0])}
                    max={45}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-400 text-sm mt-2">
                    <span>5-9%</span>
                    <span>{">40%"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 6: // Áreas com dificuldade
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual área você quer focar mais?</h2>
            </div>

            <div className="flex items-center space-x-8">
              <BodyIllustration
                highlightAreas={quizData.problemAreas}
                className="w-32 h-48"
                gender={quizData.gender === "mulher" ? "female" : "male"}
              />

              <div className="space-y-4 flex-1">
                {["Peito", "Braços", "Barriga", "Pernas", "Corpo inteiro"].map((area) => (
                  <div
                    key={area}
                    className={`rounded-lg p-4 cursor-pointer transition-all ${
                      quizData.problemAreas.includes(area)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-800 border border-gray-700 text-white"
                    }`}
                    onClick={() => handleArrayUpdate("problemAreas", area, !quizData.problemAreas.includes(area))}
                  >
                    <h3 className="text-lg font-bold">{area}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 7: // Dietas
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Você segue alguma dessas dietas?</h2>
            </div>

            <div className="space-y-4">
              {[
                { value: "vegetariano", label: "Vegetariano", desc: "Exclui carne", icon: "🌱" },
                { value: "vegano", label: "Vegano", desc: "Exclui todos os produtos de origem animal", icon: "🌿" },
                { value: "keto", label: "Keto", desc: "Baixo teor de carboidratos e alto teor de gordura", icon: "🥑" },
                {
                  value: "mediterraneo",
                  label: "Mediterrâneo",
                  desc: "Rico em alimentos à base de plantas",
                  icon: "🫒",
                },
              ].map((diet) => (
                <div
                  key={diet.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center space-x-4 ${
                    quizData.diet === diet.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("diet", diet.value)}
                >
                  <span className="text-2xl">{diet.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{diet.label}</h3>
                    <p className="text-gray-400 text-sm">{diet.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div
                className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center justify-between ${
                  quizData.diet === "nao-sigo" ? "border-2 border-orange-600" : "border border-gray-700"
                }`}
                onClick={() => updateQuizData("diet", "nao-sigo")}
              >
                <h3 className="text-lg font-bold text-white">Não, não sigo nenhuma dessas dietas</h3>
                <X className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        )

      case 8: // Frequência de açúcar
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Com qual frequência você consome doces ou bebidas alcoólicas?
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { value: "nao-frequente", label: "Não com frequência. Não sou grande fã de doces", icon: "😊" },
                { value: "3-5-vezes", label: "3-5 vezes por semana", icon: "🍭" },
                { value: "todos-dias", label: "Praticamente todos os dias", icon: "🍰" },
              ].map((freq) => (
                <div
                  key={freq.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center space-x-4 ${
                    quizData.sugarFrequency === freq.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("sugarFrequency", freq.value)}
                >
                  <span className="text-2xl">{freq.icon}</span>
                  <h3 className="text-lg font-bold text-white">{freq.label}</h3>
                </div>
              ))}
            </div>
          </div>
        )

      case 9: // Água
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Quanta água você bebe diariamente?</h2>
            </div>

            <div className="space-y-4">
              {[
                { value: "menos-2", label: "Menos de 2 copos", desc: "até 0,5 l", icon: Droplets },
                { value: "2-6", label: "2-6 copos", desc: "0,5-1,5 l", icon: Droplets },
                { value: "7-10", label: "7-10 copos", desc: "1,5-2,5 l", icon: Droplets },
                { value: "mais-10", label: "Mais de 10 copos", desc: "mais de 2,5 l", icon: Droplets },
              ].map((water) => (
                <div
                  key={water.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
                    quizData.waterIntake === water.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("waterIntake", water.value)}
                >
                  <div className="flex items-center space-x-4">
                    <water.icon className="h-6 w-6 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{water.label}</h3>
                      <p className="text-gray-400 text-sm">{water.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div
                className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center space-x-4 ${
                  quizData.waterIntake === "apenas-cafe" ? "border-2 border-orange-600" : "border border-gray-700"
                }`}
                onClick={() => updateQuizData("waterIntake", "apenas-cafe")}
              >
                <span className="text-2xl">☕</span>
                <h3 className="text-lg font-bold text-white">Bebo apenas café ou chá</h3>
              </div>
            </div>
          </div>
        )

      case 10: // Altura
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é a sua altura?</h2>
            </div>

            <div className="space-y-6">
              <Input
                type="number"
                placeholder={`Altura, cm`}
                value={quizData.height}
                onChange={(e) => updateQuizData("height", e.target.value)}
                className="bg-transparent border-0 border-b-2 border-gray-600 text-white text-center text-xl rounded-none focus:border-orange-600"
              />
            </div>
          </div>
        )

      case 11: // Peso atual
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é o seu peso atual?</h2>
            </div>

            <div className="space-y-6">
              <Input
                type="number"
                placeholder={`Peso atual, kg`}
                value={quizData.currentWeight}
                onChange={(e) => updateQuizData("currentWeight", e.target.value)}
                className="bg-transparent border-0 border-b-2 border-gray-600 text-white text-center text-xl rounded-none focus:border-orange-600"
              />
            </div>
          </div>
        )

      case 12: // Peso alvo
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é o seu objetivo de peso?</h2>
            </div>

            <div className="space-y-6">
              <Input
                type="number"
                placeholder={`Peso alvo, kg`}
                value={quizData.targetWeight}
                onChange={(e) => updateQuizData("targetWeight", e.target.value)}
                className="bg-transparent border-0 border-b-2 border-gray-600 text-white text-center text-xl rounded-none focus:border-orange-600"
              />
            </div>
          </div>
        )

      case 13: // Evento importante
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Você tem algum evento importante chegando?</h2>
            </div>

            <div className="space-y-4">
              {[
                { value: "ferias", label: "Férias", icon: "🏖️" },
                { value: "aniversario", label: "Aniversário", icon: "🎂" },
                { value: "ocasiao-familiar", label: "Ocasião familiar", icon: "👨‍👩‍👧‍👦" },
                { value: "casamento", label: "Casamento", icon: "💍" },
                { value: "competicao", label: "Competição", icon: "🏆" },
                { value: "outros", label: "Outros", icon: "📅" },
              ].map((event) => (
                <div
                  key={event.value}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center space-x-4 ${
                    quizData.importantEvent === event.value ? "border-2 border-orange-600" : "border border-gray-700"
                  }`}
                  onClick={() => updateQuizData("importantEvent", event.value)}
                >
                  <span className="text-2xl">{event.icon}</span>
                  <h3 className="text-lg font-bold text-white">{event.label}</h3>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div
                className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center justify-between ${
                  quizData.importantEvent === "nenhum" ? "border-2 border-orange-600" : "border border-gray-700"
                }`}
                onClick={() => updateQuizData("importantEvent", "nenhum")}
              >
                <h3 className="text-lg font-bold text-white">Nenhum evento especial</h3>
                <X className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        )

      case 14: // Data do evento (condicional)
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é a data do evento?</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Calendar className="h-8 w-8 text-orange-600 mr-2" />
              </div>
              <Input
                type="date"
                value={quizData.eventDate}
                onChange={(e) => updateQuizData("eventDate", e.target.value)}
                className="bg-transparent border-2 border-gray-600 text-white text-center text-xl rounded-md focus:border-orange-600 p-4"
              />
            </div>
          </div>
        )

      case 15: // Nome
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é o seu nome?</h2>
            </div>

            <div className="space-y-6">
              <Input
                type="text"
                placeholder="Nome"
                value={quizData.name}
                onChange={(e) => updateQuizData("name", e.target.value)}
                className="bg-transparent border-0 border-b-2 border-gray-600 text-white text-center text-xl rounded-none focus:border-orange-600"
              />
            </div>
          </div>
        )

      case 16: // Tempo para treinar
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Quanto tempo você tem para treinar?</h2>
            </div>

            <RadioGroup value={quizData.workoutTime} onValueChange={(value) => updateQuizData("workoutTime", value)}>
              <div className="space-y-4">
                {["15-30 minutos", "30-45 minutos", "45-60 minutos", "Mais de 1 hora", "Tempo flexível"].map((time) => (
                  <div
                    key={time}
                    className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center space-x-4 ${
                      quizData.workoutTime === time ? "border-2 border-orange-600" : "border border-gray-700"
                    }`}
                    onClick={() => updateQuizData("workoutTime", time)}
                  >
                    <RadioGroupItem value={time} id={time} />
                    <Label htmlFor={time} className="text-white text-lg cursor-pointer">
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )

      case 17: // Experiência
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Qual é sua experiência com exercícios?</h2>
            </div>

            <RadioGroup value={quizData.experience} onValueChange={(value) => updateQuizData("experience", value)}>
              <div className="space-y-4">
                {[
                  "Iniciante - Nunca treinei",
                  "Básico - Treino ocasionalmente",
                  "Intermediário - Treino regularmente",
                  "Avançado - Treino há anos",
                ].map((exp) => (
                  <div
                    key={exp}
                    className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all flex items-center space-x-4 ${
                      quizData.experience === exp ? "border-2 border-orange-600" : "border border-gray-700"
                    }`}
                    onClick={() => updateQuizData("experience", exp)}
                  >
                    <RadioGroupItem value={exp} id={exp} />
                    <Label htmlFor={exp} className="text-white text-lg cursor-pointer">
                      {exp}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )

      case 18: // Equipamentos
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Que equipamentos você tem acesso?</h2>
              <p className="text-gray-300">Selecione todos que se aplicam</p>
            </div>

            <div className="space-y-3">
              {[
                "Nenhum equipamento",
                "Halteres",
                "Faixas de resistência",
                "Barra fixa",
                "Academia completa",
                "Kettlebells",
                "Esteira",
                "Bicicleta ergométrica",
              ].map((equipment) => (
                <div key={equipment} className="flex items-center space-x-3">
                  <Checkbox
                    id={equipment}
                    checked={quizData.equipment.includes(equipment)}
                    onCheckedChange={(checked) => handleArrayUpdate("equipment", equipment, checked as boolean)}
                  />
                  <Label htmlFor={equipment} className="text-white text-lg">
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      // Perguntas sobre exercícios (19-22)
      case 19: // Cardio
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Gosto ou não gosto</h2>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <ExerciseIllustration type="cardio" className="w-full h-48 mb-4" />
              <h3 className="text-2xl font-bold text-white text-center">Cardio</h3>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => updateExercisePreference("cardio", "nao-gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.cardio === "nao-gosto"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsDown className="h-8 w-8" />
                <span>Não gosto</span>
              </button>

              <button
                onClick={() => updateExercisePreference("cardio", "neutro")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.cardio === "neutro"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <Meh className="h-8 w-8" />
                <span>Neutro</span>
              </button>

              <button
                onClick={() => updateExercisePreference("cardio", "gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.cardio === "gosto"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsUp className="h-8 w-8" />
                <span>Gosto</span>
              </button>
            </div>
          </div>
        )

      case 20: // Pull-ups
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Gosto ou não gosto</h2>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <ExerciseIllustration type="pullups" className="w-full h-48 mb-4" />
              <h3 className="text-2xl font-bold text-white text-center">Pull-ups</h3>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => updateExercisePreference("pullups", "nao-gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.pullups === "nao-gosto"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsDown className="h-8 w-8" />
                <span>Não gosto</span>
              </button>

              <button
                onClick={() => updateExercisePreference("pullups", "neutro")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.pullups === "neutro"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <Meh className="h-8 w-8" />
                <span>Neutro</span>
              </button>

              <button
                onClick={() => updateExercisePreference("pullups", "gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.pullups === "gosto"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsUp className="h-8 w-8" />
                <span>Gosto</span>
              </button>
            </div>
          </div>
        )

      case 21: // Levantamento de pesos
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Gosto ou não gosto</h2>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <ExerciseIllustration type="weights" className="w-full h-48 mb-4" />
              <h3 className="text-2xl font-bold text-white text-center">Levantamento de pesos</h3>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => updateExercisePreference("weights", "nao-gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.weights === "nao-gosto"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsDown className="h-8 w-8" />
                <span>Não gosto</span>
              </button>

              <button
                onClick={() => updateExercisePreference("weights", "neutro")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.weights === "neutro"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <Meh className="h-8 w-8" />
                <span>Neutro</span>
              </button>

              <button
                onClick={() => updateExercisePreference("weights", "gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.weights === "gosto"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsUp className="h-8 w-8" />
                <span>Gosto</span>
              </button>
            </div>
          </div>
        )

      case 22: // Ioga/Alongamento
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Gosto ou não gosto</h2>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <ExerciseIllustration type="yoga" className="w-full h-48 mb-4" />
              <h3 className="text-2xl font-bold text-white text-center">Ioga / Alongamento</h3>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => updateExercisePreference("yoga", "nao-gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.yoga === "nao-gosto"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsDown className="h-8 w-8" />
                <span>Não gosto</span>
              </button>

              <button
                onClick={() => updateExercisePreference("yoga", "neutro")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.yoga === "neutro"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <Meh className="h-8 w-8" />
                <span>Neutro</span>
              </button>

              <button
                onClick={() => updateExercisePreference("yoga", "gosto")}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                  quizData.exercisePreferences.yoga === "gosto"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <ThumbsUp className="h-8 w-8" />
                <span>Gosto</span>
              </button>
            </div>
          </div>
        )

      case 23: // Email
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Digite o seu e-mail</h2>
            </div>

            <div className="space-y-6">
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={quizData.email}
                onChange={(e) => updateQuizData("email", e.target.value)}
                className="bg-transparent border-0 border-b-2 border-gray-600 text-white text-center text-xl rounded-none focus:border-orange-600"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <button onClick={prevStep} disabled={currentStep === 1} className="p-2">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="w-16 h-8 bg-orange-600 rounded flex items-center justify-center">
          <span className="text-white text-sm font-bold">MAD</span>
          <span className="text-white text-xs ml-1">MUSCLES</span>
        </div>
        <div className="w-6"></div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="h-2 bg-gray-700 rounded-full flex-1">
            <div
              className="h-2 bg-orange-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-gray-400 ml-4 text-sm">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {renderStep()}

          {/* Continue Button */}
          <div className="mt-12">
            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg rounded-full"
              >
                Finalizar
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg rounded-full"
              >
                Continuar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
