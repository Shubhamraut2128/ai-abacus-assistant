def solve_abacus(problem):
    try:
        result = eval(problem)
        steps = []

        if "+" in problem:
            a, b = problem.split("+")
            steps.append(f"{a.strip()} + {b.strip()} = {result}")

        elif "-" in problem:
            a, b = problem.split("-")
            steps.append(f"{a.strip()} - {b.strip()} = {result}")

        elif "*" in problem:
            a, b = problem.split("*")
            steps.append(f"{a.strip()} × {b.strip()} = {result}")

        elif "/" in problem:
            a, b = problem.split("/")
            steps.append(f"{a.strip()} ÷ {b.strip()} = {result}")

        return steps

    except:
        return ["Invalid input"]