<template>
  <div>
    <Header></Header>
    <div class="container mx-5">
      <div class="row">
      <img src="../assets/KMA.jpg" class="col-md-4"/>
        <div class="col-md-1"></div>
        </div>
      <div class="row"><p class="col-md-12 my-5 text-16">KMA Schedule - курсовий проект, метою якого є полегшення
        роботи методистів шляхом автоматизації процесу створення розкладів. Також у студентів є можливість
        перегляду власного розкладу відповідно до індивідуального навчального плану.</p></div>
    </div>
    <Footer class="bottom"></Footer>
  </div>
</template>

<script>
import Header from "../components/Basic/Header";
import Footer from "../components/Basic/Footer";
export default {
  name: "Main",
  components: {Footer, Header }

};
</script>

<style scoped>
  .bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .text-16{
    font-size: 16px;
  }

</style>
