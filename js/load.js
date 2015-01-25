"use strict";

/**
  * The loading screen
  */
var _LOAD = {
  "loadBar": {},

  "loadText": {},

  "preload": function() {
    this.loadText = game.add.text(game.world.centerX, game.world.centerY - 30, "Loading...", {
      "font": "400 15px/1.5 Arcade-Normal, Arial, sans-serif",
      "fill": "#fff"
    });
    this.loadText.anchor.setTo(0.5, 0.5);
    this.loadBar = game.add.sprite(game.world.centerX - 100, game.world.centerY - 10, "progress");
    game.load.setPreloadSprite(this.loadBar);

    game.load.image("sebastian", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFkAAABfCAMAAAC0jJuAAAAAYFBMVEUAAAAAHDEAAB0aL20TLmUdHlshPHofMW0lJ2UoLGyFRgb/669HRXMwN15CWYwxKlj///9CRHsmNHEjNnIAAAD/9tv7/v/g4OAqLWsjN3Xi9/33/f8AChiIThYhJmnp+f0jdn5wAAAAAXRSTlMAQObYZgAAAktJREFUeF7V2OeO4yAYhWF/H2Cnlumz/f7vcgGTOQsxmKFoJ+/foEfoOEXKUBMNjesv84Z7wTtywM+55/by49y5lXzesQX4fe+iRlvoaOwmm9rKNMtsO1xl1tXKzGcj72+jpwyAXD6KZRfD8UTs+pTM6zJv31w05sigdckhCuSc58i6hxIZzzE9xEX39WUy1ckkpYwMbCe+mGLyISkLpW7dRzdDRMYW+UtARo1lCway6UbemXJlWpbZVCczPwCEbKMxlGMRUeRd7IE58rPtQ2bm5jKiKZCtGsi2NjLyZFMXmU0VsivcGmNDNjWUTZ6MimR/Ej7kykjOnSzm8uXfFozLNAtDmJrbVsjCCis/2p+XCUiO7KqUsfepSJ5eV2Rs3UZOfB4by667l0/FMpK2ky+/7RvIHx9HtC7rhszScuizLkrRv+XLiKY/yzD7nXfXAK3J3xdl5oN/tF7GL1wv2dVYJk/O6pcpIWNkyGVBDqe4L5nayxi5tYwpussA6mWiXjJj5GYylrgrGRvDbSNj46YypsA/CEdZ4crYyCT0C2pTLouoPEKuuXEom1eqZBGVRaU8vcbkp84yX2WSpmMSw4GkPAayULrINjiyKZCnH4NOHuMXNkS5rDbxC1sZ77lF2V7gVrbJ5fzjJGKyUFFZLRfIE1jImMKXh3RpGX9ldpGFUp3kcfGoHAplPPfIUVEnK13saKmMvrpM6/L2pURm7iDjG6mtvL246Nv/lylTfnFly8xDXtKVc4nrcGOWrFzFcn0YrkpOD9c6DFfeX4ZY16f1Q/izAAAAAElFTkSuQmCC");
    game.load.image("sweetums", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAABwCAMAAACJrcidAAAAHlBMVEUAAAD////xb6n3jLz8qM0lNXH/uNgAChgAcbz5k8Ho2DWjAAAAAXRSTlMAQObYZgAAAKRJREFUeNrt1tEKgzAMheE4l0Xf/4WX1YhSRXIqDCnnv/LmI6KQVsDMEzj1cDN44DRrUurKUBODtJvXC1UGUVFRUf1XWaaiSkE1lat4iNFgZj/1AutbTWCtiv+rViMY1VG9waiOagZb1AesbzWAUd1Xzz+/eOrdV83f0DMPILu7KKB0f/dNmuoKTUVFRdWXig2cW7vVNEXW7lpCyVl2nZyn18nWFzSjL06t5JcsAAAAAElFTkSuQmCC");
    game.load.image("carrot", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABECAMAAAAlfZIvAAAAXVBMVEUAAAD8/PyCgXywsK6ZmZjz8/MDBQNQWVHh4OAcEAonKikEIAXGxsY6RDgJVgoEOAQGYAgHRgkIbgwPghJnaWcTnRl7PBFSJAWqTQ3tawrKXg//exL3cAz/cwzeYwr2H+frAAAAAXRSTlMAQObYZgAABR1JREFUeAGs08sSpioMBGDDJSAhFyK+/6sOWqdme+p3yJLFV92WffzfwQEhwrHpYHEp5oClbuFyhhhiOFsjSrBD7BwSYxMlsRH3kA0XN0yGubY9MWsx88vNTAg5HxsuT5X7vlzMhm5rrtd9mYn5mBV2FJ9N/BGVhiL3Lc2DyIopiLMHrlvIQqv5fWmrR94zn86ovsw79F17zH0O8xVzcMpbxGffOlZKJwz/AtX8cnDUWGtD8kVqq19jpQ69lbq4lHppsUZmdzcr8WPxdJZAiC3FhK0Qd8iRzdwFMXwyc0NU04XyIBLjFS2SPiTh/BQyIJL5OxYTMRur7nye3IQjfNp0OYfZQlXFlojY15tcDynzm5nn8GfPJ5KYmHKHoxbxZSLOenwxC2lDjIHHQzqnCr2RXa54pm+/JGKKoUNOYuYu1GZiJHf5GxJ+rJ9TzDnDAZN0RTNFGkPlxePLQfz5k8K7ncqIw9eN8aR1MykRoIeYWgsVfuAAAq8UAH2yLexykf/I8acVM25uEAWieAFFEIkxZRAU+f4f894SOmN7JM01t384dZz5+Xb3LWszdNMonV+1pAq/lHLP+Mi51IpRhsoWawJZmFRMG8Ia4uZXKeHX36FOOgejzzMOsV4o1pGNFlqPlbkYv+8xxnRsXsuRT/1vIoXT82UGxSnF9dAZaT4RtB8JScZfw7Ef6QA4rIBOv9eR08CgxwOnSV/mK3BAErRuch32I+aYCKpt/2tjem0WSFmMhFr8hdX4SZcCpUmSUm+EzBFCjyyeI5UdJo7iUeVgmxtlSn25kOEp+SJSBqBSjAdi3+zzdSRGbTDan8iUcNU2VAi8gPZEEbnGHbCEADLAS88MypSbr9dauHtA6nK5GGNuReRyrySCMk8QG1aJLj7x0kQaS9yKw5cFmRozSIM3lcmUPn4hE2WeyEvSPRTK6Gz4ImKoF6TltIWflksxuim9qSKPEinDS4+t1HM730ojzEw47uzUdwrql4VEG4hMe+GQyEKE7bfwZCExgW7ANkaOQmDMVS0ShmjB5KA3+SyyMlPmXf8YaQylOGvHTl8/rLPycrsb6DiLrPigR/fIoIxryEFYzn6so5OBziIJf5/MBwZlE7fXcpAPP5jDPFcDnYm19TtaJMmgbRvhNEOgmN+ed1KvqyYDfU+73ux7OZdEO3MpibmYbyp7akwOW1Mk3eww6OramQs7lqV4O48Zc5TzDmBbZIl9a1uJGnG7GtjSWnWe/tqYnyLz6WYbbbtDypqLla4bBnV+UchfIstwN/ApaKldq5xcWjHx6QNL99w1v250pKVUdbVqQF5yjeSngWONsX91TYeUYo6N3tSg13nfXO/Ng2pyPifigdvqTfXnvqGar4biAQ2quFYlM+LIfnhtudcT32PbtIkUMRKUhkiol4hMjJifkErbiQy557S/rJB9ew+3/eoIugGaYKgY0/fexCKaHnr7cjl7McB46JIHubb+ZH+KRJMZhXqZyVQ3YNa503L1Wzxo5vf9hLzv4UDr7eN1KB9pE5W6bmFdQyzQikwVKcf/8kFfNhETjkrgcSlQyKX9G5tD9DrZjgKaibyV4pIXKjLm4Lu//CMjerpaiboOI5ErNEXs0ICnfw0FuT0TINe65gPX6LWb3oCqe9vudfWFHMt6U+/+CEBQ7y2VoK636S1i/YAep6l4IcMFnrN3kZT99MHghfthEGl5vR0FUeuKQRjf0Nk8YTqu3duoc12twOXj/wxWt80/oeKdc2DTbCYAAAAASUVORK5CYII=");
  },

  "create": function() {
    game.state.start("start");
  }
};