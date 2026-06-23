import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { pegarImagem } from '../utils/imagemProduto.js'

const SLIDES = [
  {
    bg: 'slide-1',
    emoji: '🐶',
    deco: '🐕',
    titulo: ['Ração Premium', 'para Cães Adultos'],
    precoAntigo: 'R$ 94,90',
    preco: '85',
    centavos: '90',
    cta: 'Clique e Aproveite →',
  },
  {
    bg: 'slide-2',
    emoji: '🐱',
    deco: '🐈',
    titulo: ['Semana do', 'Gato Feliz 🎉'],
    precoAntigo: 'R$ 75,00',
    preco: '59',
    centavos: '90',
    cta: 'Ver Ofertas →',
  },
  {
    bg: 'slide-3',
    emoji: '💊',
    deco: '💉',
    titulo: ['Antiparasitários', 'com até 20% OFF'],
    precoAntigo: 'R$ 120,00',
    preco: '96',
    centavos: '00',
    cta: 'Confira →',
  },
]

const CATEGORIAS = [
  { emoji: '🐶', label: 'Cachorros' },
  { emoji: '🐱', label: 'Gatos' },
  { emoji: '🐦', label: 'Pássaros' },
  { emoji: '🐟', label: 'Peixes' },
  { emoji: '🐰', label: 'Outros Pets' },
  { emoji: '🌿', label: 'Casa e Jardim' },
]

const fmtPreco = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

export default function Home({ addToCart, currentUser, showToast }) {
  const navigate = useNavigate()
  const [slideAtual, setSlideAtual] = useState(0)

  const produtos = useSelector((s) => s.products.list)
  const destaque = produtos.slice(0, 5)

  const proximoSlide = useCallback(() => {
    setSlideAtual((s) => (s + 1) % SLIDES.length)
  }, [])

  const slideAnterior = () => {
    setSlideAtual((s) => (s - 1 + SLIDES.length) % SLIDES.length)
  }

  const irParaSlide = (i) => {
    setSlideAtual(i)
  }

  useEffect(() => {
    const timer = setInterval(proximoSlide, 4000)
    return () => clearInterval(timer)
  }, [proximoSlide])

  const handleAgendar = () => {
    if (!currentUser) {
      showToast('Faça login para agendar um serviço.', 'info')
      return
    }

    navigate('/agendar')
  }

  return (
    <div id="page-home" className="page">
      <div className="hero">
        <div
          className="slides-wrap"
          style={{ transform: `translateX(-${slideAtual * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div key={i} className={`slide ${slide.bg}`}>
              <div className="slide-content">
                <div className="slide-emoji">{slide.emoji}</div>

                <div className="slide-text">
                  <h2>
                    {slide.titulo[0]}
                    <br />
                    {slide.titulo[1]}
                  </h2>

                  <div className="old-price">de: {slide.precoAntigo}</div>

                  <div className="new-price">
                    <span>R$</span> {slide.preco}
                    <sup>,{slide.centavos}</sup>
                  </div>

                  <button className="slide-cta" onClick={() => navigate('/loja')}>
                    {slide.cta}
                  </button>
                </div>
              </div>

              <div className="slide-deco">{slide.deco}</div>
            </div>
          ))}
        </div>

        <div className="carousel-nav prev">
          <button onClick={slideAnterior}>‹</button>
        </div>

        <div className="carousel-nav next">
          <button onClick={proximoSlide}>›</button>
        </div>

        <div className="carousel-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === slideAtual ? 'active' : ''}`}
              onClick={() => irParaSlide(i)}
            />
          ))}
        </div>
      </div>

      <div className="features-strip">
        <div className="feat-item">
          <div className="feat-icon">🚚</div>
          <div className="feat-text">
            <h4>Entrega expressa</h4>
            <p>Em até 4 horas</p>
          </div>
        </div>

        <div className="feat-item">
          <div className="feat-icon">🎁</div>
          <div className="feat-text">
            <h4>Leve 6 pague 5</h4>
            <p>Itens selecionados</p>
          </div>
        </div>

        <div className="feat-item">
          <div className="feat-icon">🏪</div>
          <div className="feat-text">
            <h4>Compre e retire</h4>
            <p>Com 5% off acima de R$179</p>
          </div>
        </div>

        <div className="feat-item">
          <div className="feat-icon">🔄</div>
          <div className="feat-text">
            <h4>Compra Programada</h4>
            <p>Programe e ganhe 10% off</p>
          </div>
        </div>
      </div>

      <div className="home-section">
        <div className="section-title">
          Explore por <span>Categoria</span>
        </div>

        <div className="cats-grid">
          {CATEGORIAS.map((cat) => (
            <div
              key={cat.label}
              className="cat-card"
              onClick={() =>
                navigate(`/loja?categoria=${encodeURIComponent(cat.label)}`)
              }
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span className="cat-label">{cat.label}</span>
            </div>
          ))}
        </div>

        <div className="promo-banner">
          <div className="promo-text">
            <h2>Serviços Especializados</h2>
            <p>Banho & Tosa, Veterinário, Vacinas e muito mais</p>
            <div className="promo-price">
              <small>R$ 60,00</small> R$ 49,90
            </div>
          </div>

          <button className="btn-promo" onClick={handleAgendar}>
            Agendar Serviço →
          </button>
        </div>

        <div className="section-title">
          Produtos em <span>Destaque</span>
        </div>

        <div className="products-grid">
          {destaque.map((prod) => {
            const imagem = pegarImagem(prod)

            return (
              <div
                key={prod._id}
                className="prod-card"
                onClick={() => navigate(`/produto/${prod._id}`)}
              >
                <div className="prod-img">
                  {imagem ? (
                    <img
                      className="prod-media-img"
                      src={imagem}
                      alt={prod.name}
                    />
                  ) : (
                    <span className="prod-media">{prod.emoji || '📦'}</span>
                  )}
                </div>

                <div className="prod-info">
                  <div className="prod-name">{prod.name}</div>
                  <div className="prod-price">{fmtPreco(prod.price)}</div>

                  <button
                    className="btn-add-cart"
                    disabled={prod.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(prod)
                    }}
                  >
                    {prod.stock === 0 ? 'Esgotado' : '+ Adicionar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}