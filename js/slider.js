class Slider {
  constructor(selector) {
    this.mainElement = document.querySelector(selector)
    this.sliderPagination = this.mainElement.querySelector('.slide-pagination')
    this.slideWrap = this.mainElement.querySelector('.slide-wrap')
    this.slides = this.mainElement.querySelectorAll('.slide')
    this.sliderButtons = this.mainElement.querySelectorAll('.slider-button')
    this.sliderButtonLeft = this.mainElement.querySelector('.left-button')
    this.sliderButtonRight = this.mainElement.querySelector('.right-button')
    this.wrapperWidth = parseFloat(getComputedStyle(this.slideWrap).width)
    this.slideWidth = parseFloat(getComputedStyle(this.slides[0]).width)
    this.html = this.mainElement.innerHTML
    this.indexIndicator = 0
    this.maxIndexIndicator = this.slides.length - 1
    this.indicatorItems = 0
    this.positionLeftItem = 0
    this.transform = 0
    this.step = this.slideWidth / this.wrapperWidth * 100
    this.items = []
    this.slides.forEach((item, index) => {
      this.items.push({ item: item, position: index, transform: 0 });
    });
    this.addIndicators()
    this.setUpListeners()
  }
  isElementVisible(element) {
    const rect = element.getBoundingClientRect()
    const vWidth = window.innerWidth || document.documentElement.clientWidth
    const vHeight = window.innerHeight || document.documentElement.clientHeight
    elemFromPoint = (x, y) => document.elementFromPoint(x, y)
    if (rect.right < 0 || rect.bottom < 0
      || rect.left > vWidth || rect.top > vHeight)
      return false;
    return (
      element.contains(elemFromPoint(rect.left, rect.top))
      || element.contains(elemFromPoint(rect.right, rect.top))
      || element.contains(elemFromPoint(rect.right, rect.bottom))
      || element.contains(elemFromPoint(rect.left, rect.bottom))
    );
  }
  transformItem(direction) {
    let nextItem
    const currentIndicator = this.indexIndicator;
    /* if (!isElementVisible(this.mainElement)) {
      return;
    } */
    if (direction === 'right') {
      this.positionLeftItem++;
      //  (this.positionLeftItem + this.wrapperWidth / this.slideWidth - 1) > this.position.getMax()
      if (this.positionLeftItem > this.position.getMax()) {
        nextItem = this.position.getItemMin();
        this.items[nextItem].position = this.position.getMax() + 1;
        this.items[nextItem].transform += this.items.length * 100;
        this.items[nextItem].item.style.transform = 'translateX(' + this.items[nextItem].transform + '%)';
      }
      this.transform -= this.step;
      this.indexIndicator = this.indexIndicator + 1;
      if (this.indexIndicator > this.maxIndexIndicator) {
        this.indexIndicator = 0;
      }
    }
    if (direction === 'left') {
      this.positionLeftItem--;
      if (this.positionLeftItem < this.position.getMin()) {
        nextItem = this.position.getItemMax();
        this.items[nextItem].position = this.position.getMin() - 1;
        this.items[nextItem].transform -= this.items.length * 100;
        this.items[nextItem].item.style.transform = 'translateX(' + this.items[nextItem].transform + '%)';
      }
      this.transform += this.step;
      this.indexIndicator = this.indexIndicator - 1;
      if (this.indexIndicator < 0) {
        this.indexIndicator = this.maxIndexIndicator;
      }
    }
    this.slideWrap.style.transform = 'translateX(' + this.transform + '%)';
    this.indicatorItems[currentIndicator].classList.remove('pagination-button_active');
    this.indicatorItems[this.indexIndicator].classList.add('pagination-button_active');
  }
  slideTo(to) {
    let i = 0
    const direction = (to > this.indexIndicator) ? 'right' : 'left';
    while (to !== this.indexIndicator && i <= this.maxIndexIndicator) {
      this.transformItem(direction);
      i++;
    }
  }
  controlClick = (e) => {
    if (e.target.classList.contains('slider-button')) {
      // e.preventDefault();
      var direction = e.target.classList.contains('right-button') ? 'right' : 'left';
      this.transformItem(direction);
    }
    if (e.target.getAttribute('data-slide-to')) {
      // e.preventDefault();
      this.slideTo(parseInt(e.target.getAttribute('data-slide-to')));
    }
  };
  refresh() {
    this.mainElement.innerHTML = this.html;
    this.sliderPagination = this.mainElement.querySelector('.slide-pagination')
    this.slideWrap = this.mainElement.querySelector('.slide-wrap');
    this.slides = this.mainElement.querySelectorAll('.slide');
    this.sliderButtons = this.mainElement.querySelectorAll('.slider-button');
    this.sliderButtonLeft = this.mainElement.querySelector('.left-button');
    this.sliderButtonRight = this.mainElement.querySelector('.right-button');
    this.wrapperWidth = parseFloat(getComputedStyle(this.slideWrap).width);
    this.slideWidth = parseFloat(getComputedStyle(this.slideWrap[0]).width);
    this.positionLeftItem = 0;
    this.transform = 0;
    this.indexIndicator = 0;
    this.maxIndexIndicator = this.slides.length - 1;
    this.step = this.slideWidth / this.wrapperWidth * 100;
    this.items = [];
    this.slides.forEach((item, index) => {
      this.items.push({ item: item, position: index, transform: 0 });
    });
    this.addIndicators();
  }
  setUpListeners() {
    this.mainElement.addEventListener('click', this.controlClick);
  }
  addIndicators() {
    const sliderIndicators = document.createElement('div');
    sliderIndicators.classList.add('wrap-pagination-buttons');
    let sliderIndicatorsItem
    for (let i = 0; i < this.slides.length; i++) {
      sliderIndicatorsItem = document.createElement('span');
      sliderIndicatorsItem.classList.add('pagination-button')
      if (i === 0) {
        sliderIndicatorsItem.classList.add('pagination-button_active');
      }
      sliderIndicatorsItem.setAttribute("data-slide-to", i);
      sliderIndicators.appendChild(sliderIndicatorsItem);
    }
    this.sliderPagination.appendChild(sliderIndicators);
    this.indicatorItems = this.sliderPagination.querySelectorAll('.wrap-pagination-buttons > span')
  }
  position = {
    getItemMin: () => {
      let indexItem = 0;
      this.items.forEach((item, index) => {
        if (item.position < this.items[indexItem].position) {
          indexItem = index;
        }
      });
      return indexItem;
    },
    getItemMax: () => {
      let indexItem = 0;
      this.items.forEach((item, index) => {
        if (item.position > this.items[indexItem].position) {
          indexItem = index;
        }
      });
      return indexItem;
    },
    getMin: () => {
      let indexItem = 0;
      this.items.forEach((item, index) => {
        if (item.position < this.items[indexItem].position) {
          indexItem = index;
        }
      });
      return this.items[indexItem].position;
    },
    getMax: () => {
      let indexItem = 0;
      this.items.forEach((item, index) => {
        if (item.position > this.items[indexItem].position) {
          indexItem = index;
        }
      });
      return this.items[indexItem].position;
    }
  }
}
