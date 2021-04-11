<template>
  <div>
    <Header></Header>
    <div class="mx-5 text-center">
      <img src="../assets/KMA.jpg" class="w-25" />
      <p class="col-md-12 mt-5 mb-4 text-16 text-left">
        KMA Schedule – курсовий проект, створений на основі бази даних системи
        автозапису на вибіркові дисципліни НаУКМА, призначений надавати доступ
        до триместрових розкладів занять в Національному університеті
        «Києво-Могилянська академія».<br />
        Метою проекту є спрощення процесу створення розкладів для методистів
        НаУКМА шляхом його автоматизації та узагальнення формату і вигляду
        розкладів для усіх факультетів. Також, студентам буде надана можливість
        переглядати зведений розклад за індивідуальним навчальним планом, щоб
        полегшити формування власного розкладу на етапі запису в групи.
      </p>
    </div>

    <Footer class="bottom"></Footer>
  </div>
</template>

<script>
import Header from "../components/Basic/Header";
import Footer from "../components/Basic/Footer";
export default {
  name: "Main",
  components: { Footer, Header }
};
</script>

<style scoped>
.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.text-16 {
  font-size: 16px;
}
</style>
