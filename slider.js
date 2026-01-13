// Space Slider
class SpaceSlider {
  constructor() {
    this.currentIndex = 0;
    this.track = document.querySelector('.Space-slider-track');
    this.wrapper = document.querySelector('.Space-slider-wrapper');
    this.pages = document.querySelectorAll('.Space-page');
    this.prevBtn = document.querySelector('.Space-slider-prev');
    this.nextBtn = document.querySelector('.Space-slider-next');
    this.dotsContainer = document.querySelector('.Space-slider-dots');
    
    this.isMobile = window.innerWidth <= 430;
    this.totalSlides = this.pages.length;
    
    this.init();
  }
  
  init() {
    this.checkMobile();
    this.createDots();
    
    if (!this.isMobile) {
      this.updateSlider();
      this.addEventListeners();
    } else {
      this.setupMobileScroll();
    }
    
    // 윈도우 리사이즈 시 업데이트
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.checkMobile();
      
      if (wasMobile !== this.isMobile) {
        // 모바일/데스크톱 전환 시 재초기화
        if (this.isMobile) {
          this.setupMobileScroll();
        } else {
          this.updateSlider();
        }
      } else if (!this.isMobile) {
        this.updateSlider();
      }
    });
  }
  
  checkMobile() {
    this.isMobile = window.innerWidth <= 430;
  }
  
  setupMobileScroll() {
    // 모바일: 가로 스크롤 설정
    if (!this.wrapper) return;
    
    // transform 제거
    this.track.style.transform = '';
    
    // 터치 스크롤은 CSS로 처리되므로 추가 작업 불필요
    // 도트는 숨기거나 스크롤 진행도로 업데이트 가능
    this.dotsContainer.style.display = 'none';
  }
  
  setTrackWidth() {
    // track width는 CSS에서 처리하므로 설정하지 않음
    this.track.style.width = '';
  }
  
  createDots() {
    if (this.isMobile) {
      this.dotsContainer.style.display = 'none';
      return;
    }
    
    this.dotsContainer.style.display = 'flex';
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('Space-slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }
  
  addEventListeners() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
  }
  
  updateSlider() {
    if (this.isMobile) return;
    
    // 모든 화면 크기에서 동일하게 페이지 단위로 이동
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.Space-slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update button states
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
  }
  
  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
      this.updateSlider();
    }
  }
  
  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SpaceSlider();
  
  // Initialize News Board Pagination
  const newsBoard = document.querySelector('.News-board-list');
  if (newsBoard) {
    new NewsBoardPagination();
  }
});

// News Pagination
class NewsBoardPagination {
  constructor() {
    this.boardList = document.querySelector('.News-board-list');
    this.items = Array.from(this.boardList.querySelectorAll('.News-board-item'));
    this.pageButtons = document.querySelectorAll('.News-page-num');
    this.prevButton = document.querySelectorAll('.News-page-arrow')[1]; // 두 번째 이전 버튼
    this.nextButton = document.querySelectorAll('.News-page-arrow')[2]; // 첫 번째 다음 버튼
    this.firstButton = document.querySelectorAll('.News-page-arrow')[0]; // 첫 페이지 버튼
    this.lastButton = document.querySelectorAll('.News-page-arrow')[3]; // 마지막 페이지 버튼
    
    this.itemsPerPage = 5;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    
    this.init();
  }
  
  init() {
    this.addEventListeners();
    this.showPage(1);
  }
  
  addEventListeners() {
    // 페이지 번호 버튼
    this.pageButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => this.goToPage(index + 1));
    });
    
    // 이전 페이지
    this.prevButton.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1);
      }
    });
    
    // 다음 페이지
    this.nextButton.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
      }
    });
    
    // 첫 페이지
    this.firstButton.addEventListener('click', () => {
      this.goToPage(1);
    });
    
    // 마지막 페이지
    this.lastButton.addEventListener('click', () => {
      this.goToPage(this.totalPages);
    });
  }
  
  goToPage(pageNum) {
    if (pageNum < 1 || pageNum > this.totalPages) return;
    
    this.currentPage = pageNum;
    this.showPage(pageNum);
    this.updatePagination();
  }
  
  showPage(pageNum) {
    // 모든 아이템 숨기기 (fade out)
    this.items.forEach((item, index) => {
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity = '0';
      item.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    });
    
    // 현재 페이지 아이템 표시 (fade in)
    const startIndex = (pageNum - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.items.length);
    
    setTimeout(() => {
      for (let i = startIndex; i < endIndex; i++) {
        const item = this.items[i];
        item.style.display = 'flex';
        
        // Force reflow
        item.offsetHeight;
        
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      }
    }, 300);
  }
  
  updatePagination() {
    // 페이지 번호 버튼 활성화 상태 업데이트
    this.pageButtons.forEach((btn, index) => {
      btn.classList.toggle('is-current', index + 1 === this.currentPage);
    });
    
    // 화살표 버튼 비활성화 상태 업데이트
    this.firstButton.disabled = this.currentPage === 1;
    this.prevButton.disabled = this.currentPage === 1;
    this.nextButton.disabled = this.currentPage === this.totalPages;
    this.lastButton.disabled = this.currentPage === this.totalPages;
  }
}

