var data = {
    firstName: 'Ahmed',
    lastName: 'Ali',
    age: 26
};

var actions = {
    actionOne: function () {
        console.log('this is action one!');
    },
    actionTwo: function () {
        console.log('this is action two!');
    }
};

var paths = [
    {
        path: ['firstName == Ahmed', 'lastName == Mohamed && age == 26'],
        actions: ['actionOne', 'actionTwo']
    },
    {
        path: ['firstName == Ahmed', 'lastName == Mohamed && age == 26'],
        actions: ['actionOne']
    },
    {
        path: ['firstName == Ahmed', 'lastName != Mohamed && age == 26'],
        actions: ['actionTwo']
    }
];

exec(data, actions, paths);

function exec(data, actions, paths) {
    for (var i = 0; i < paths.length; i++) {
        for (var x = 0; x < paths[i].path.length; x++) {
            var result = expression(data, paths[i].path[x]); 
            if (!result) break;
            if (x + 1 === paths[i].path.length && result) {
                execActions(actions, paths[i].actions);
                return;
            }
        }
    }
}

function execActions(actions, actionsToExec) {
    for (var i = 0; i < actionsToExec.length; i++) {
        actions[actionsToExec[i]]();
    }
}

function expression(obj, exp) {
  data = obj;
  return compare(exp);
}

function compare(exp) {
  var op = nextOperator(exp);
  if (!op) return evaluate(exp);
  var beforeOp = evaluate(exp.slice(0, op.index - 1));

  if (op.op === '||' && beforeOp) return beforeOp;
  if (op.op === '&&' && !beforeOp) return beforeOp;

  return compare(exp.slice(op.index + 3, exp.length));

}

function nextOperator(exp) {
  for (var i = 0; i < exp.length; i++) {
    if (exp[i] + exp[i + 1] === '||' || exp[i] + exp[i + 1] === '&&') {
      return { index: i, op: exp[i] + exp[i + 1] };
    }
  }
}

function evaluate(exp) {
  var exp = exp.split(' ');

  // evaluate values.
  exp[0] = data[exp[0]] || exp[0];
  exp[2] = data[exp[2]] || exp[2];

  switch (exp[1]) {
    case '==':
      return exp[0] == exp[2];
      break;
    case '>':
      return exp[0] > exp[2];
      break;
    case '<':
      return exp[0] < exp[2];
      break;
    case '>=':
      return exp[0] >= exp[2];
      break;
    case '<=':
      return exp[0] <= exp[2];
      break;
    case '!=':
      return exp[0] != exp[2];
      break;
    default:
      return null;
  }

}