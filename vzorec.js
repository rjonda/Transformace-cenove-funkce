
function getOverallLvLosses( p, q ) {
  return getTransformationLosses( p, q ) + getLvTransitionLosses( p, q );
}

function getOverallLvLosses( s ) {
  return getTransformationLosses( s ) + getLvTransitionLosses( s );
}

function getTransformationLosses( p, q ) {
  return getTransformationLosses( getS( p, q) );
}

function getTransformationLosses( s ) {
  var p_0 = 0;      // ztraty naprazdno = zatim 0 %
  var p_k = 0.05;   // maximalni ztraty vznikle transformaci = 5 %
  var s_n = 300;    // zdanlivy vykon transformatoru = 300 kW
  
  return p_0 + p_k * Math.pow( s / s_n, 2 );
}

function getLvTransitionLosses( p, q ) {
  return getLvTransitionLosses( getS( p, q) );
}

function getLvTransitionLosses( s ) {
  var r = 0.7;      // odpor stanoven fixne na 0.7 ohmu
  var u = 400;      // trifazove souctove = 400 V
  
  return r * Math.pow( s / u, 2 );
}

function getS( p, q ) {
  return Math.sqrt( p*p + q*q );
}

// Dale jen stare veci



function getActiveEnergy(maxValue, value) {
  return value - (0.6 * value * Math.atan(10 * value / maxValue));
}

function getFileData() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     //
  var data = "0.03;0.032;0.021;0.051;0.077;0.033;0.057;0.032;0.042;0.033;0.033;0.056;0.042;0.047;0.049;0.032;0.059;0.046;0.045;0.046;0.025;0.081;0.035;0.042;0.053;0.052;0.086;0.054;0.019;0.025;0.088;0.078;0.065;0.102;0.102;0.08;0.082;0.037;0.039;0.078;0.06;0.078;0.071;0.087;0.096;0.053;0.076;0.065;0.059;0.081;0.066;0.149;0.057;0.071;0.078;0.061;0.085;0.059;0.072;0.201;0.081;0.102;0.06;0.068;0.073;0.058;0.127;0.156;0.096;0.082;0.057;0.186;0.035;0.042;0.07;0.087;0.108;0.073;0.068;0.08;0.062;0.09;0.065;0.197;0.263;0.405;0.175;0.181;0.166;0.161;0.12;0.15;0.375;0.157;0.132";
  return data;
}