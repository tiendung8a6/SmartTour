import React from "react";
import { Hero } from "../components";
import { Stats } from "../components";
import { Accordion } from "../components";
import { Blog } from "../components";
import { CTASections } from "../components";
import { Feature } from "../components";
import { Feature2 } from "../components";
import { Feature3 } from "../components";
import { Testimonials } from "../components";
import { Contact } from "../components";
const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <Stats></Stats>
      <Feature2></Feature2>
      <Feature></Feature>
      <Feature3></Feature3>
      <Blog></Blog>
      <Accordion></Accordion>
      <CTASections></CTASections>
      <Contact></Contact>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;
